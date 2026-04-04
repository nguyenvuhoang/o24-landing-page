-- =============================================================================
-- Project Reports Schema for Supabase
-- Run this in the Supabase SQL Editor to set up tables for the reporting system
-- =============================================================================

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Weekly Reports table
CREATE TABLE IF NOT EXISTS weekly_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    overall_progress INTEGER NOT NULL DEFAULT 0
        CHECK (overall_progress >= 0 AND overall_progress <= 100),
    overall_status TEXT NOT NULL DEFAULT 'on-track'
        CHECK (overall_status IN ('on-track', 'at-risk', 'delayed', 'completed')),
    summary TEXT,
    ongoing_activities JSONB NOT NULL DEFAULT '[]'::jsonb,
    parallel_workstreams JSONB NOT NULL DEFAULT '[]'::jsonb,
    achievements JSONB NOT NULL DEFAULT '[]'::jsonb,
    next_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
    risks JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, week_number)
);

-- Project Milestones table
CREATE TABLE IF NOT EXISTS project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'in-progress', 'completed')),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_weekly_reports_updated_at
    BEFORE UPDATE ON weekly_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_weekly_reports_project_id ON weekly_reports(project_id);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_week ON weekly_reports(project_id, week_number);
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);

-- =============================================================================
-- Seed Data: W4S Project
-- =============================================================================

INSERT INTO projects (name, slug, description, status)
VALUES ('W4S Mobile Application', 'w4s', 'Dự án phát triển ứng dụng di động W4S', 'active')
ON CONFLICT (slug) DO NOTHING;

-- Seed milestones
WITH w4s AS (SELECT id FROM projects WHERE slug = 'w4s')
INSERT INTO project_milestones (project_id, title, description, target_date, status, sort_order)
VALUES
    ((SELECT id FROM w4s), 'Hoàn tất review Figma', 'Complete Figma review and finalize UI/UX alignment', '2026-04-04', 'completed', 1),
    ((SELECT id FROM w4s), 'Release version thiết kế', 'Điều chỉnh giao diện app theo Figma và bàn giao test', '2026-04-20', 'in-progress', 2),
    ((SELECT id FROM w4s), '[W4S] Đăng ký tài khoản Store', 'W4S hoàn thành đăng ký Apple Developer & Google Play Developer', '2026-04-18', 'pending', 3),
    ((SELECT id FROM w4s), 'Release test nghiệp vụ', 'Deliver final testing version covering all business functionalities', '2026-05-08', 'pending', 4),
    ((SELECT id FROM w4s), 'UAT Testing', 'Conduct User Acceptance Testing with stakeholders', '2026-05-22', 'pending', 5),
    ((SELECT id FROM w4s), 'App Store / Google Play Release', 'Submit and release on App Store and Google Play', '2026-05-31', 'pending', 6)
ON CONFLICT DO NOTHING;

-- Seed initial weekly report (matching current hard-coded data)
WITH w4s AS (SELECT id FROM projects WHERE slug = 'w4s')
INSERT INTO weekly_reports (
    project_id, week_number, week_start, week_end,
    overall_progress, overall_status, summary,
    ongoing_activities, parallel_workstreams, achievements, next_actions, risks,
    updated_by
)
VALUES (
    (SELECT id FROM w4s),
    1,
    '2026-03-30',
    '2026-04-04',
    35,
    'on-track',
    'Dự án hiện đang trong giai đoạn chốt thiết kế, các bên liên quan đang tích cực review giao diện Ứng dụng W4S trên Figma. Song song đó, một bản prototype thử nghiệm cũng đã được phát hành nhằm cung cấp trải nghiệm sử dụng thực tế và mang tính trực quan cao hơn. Hai luồng công việc này đang chạy song song để tối ưu hóa thời gian bàn giao.',
    '["Review thiết kế Figma với các bên liên quan", "Phát triển bản prototype thử nghiệm", "Thu thập feedback từ team nghiệp vụ"]'::jsonb,
    '[{"name": "Thiết Kế", "icon": "figma", "steps": ["Review Figma", "Nhận Feedback", "Điều Chỉnh"]}, {"name": "Ứng Dụng", "icon": "smartphone", "steps": ["Bản Thử Nghiệm", "Review Trải Nghiệm", "Nhận Feedback"]}]'::jsonb,
    '["Thiết kế Figma đang được các bên liên quan review và chốt tích cực", "Bản dùng thử của app W4S đã được phát hành thành công", "Team nghiệp vụ có thể đánh giá UI/UX một cách trực quan thông qua app thật", "Vòng lặp nhận feedback nhanh và hiệu quả hơn đáng kể nhờ có sẵn prototype", "Cấu trúc động (dynamic app) cho phép thay đổi giao diện và nội dung vô cùng vượt trội"]'::jsonb,
    '[{"title": "Hoàn tất review Figma", "shortDesc": "Complete Figma review and finalize UI/UX alignment across stakeholders", "fullDesc": "Hoàn thành việc review toàn bộ thiết kế ứng dụng W4S Mobile Application. Thống nhất UI/UX cuối cùng giữa các bên liên quan và đóng băng thiết kế (design freeze) để chuyển sang giai đoạn triển khai ổn định.", "status": "completed", "timeframe": "Tuần 1", "priority": "high"}, {"title": "Release version thiết kế", "shortDesc": "Release application version fully aligned with approved design", "fullDesc": "Cập nhật ứng dụng đảm bảo đúng 100% theo Figma đã được duyệt. Đồng bộ UI thực tế với thiết kế chuẩn và đảm bảo không còn sai lệch.", "status": "pending", "timeframe": "Tuần 2 - 3", "priority": "high"}, {"title": "Release test nghiệp vụ", "shortDesc": "Deliver final testing version covering all business functionalities", "fullDesc": "Phát hành bản test hoàn chỉnh cho toàn bộ các chức năng nghiệp vụ. Đảm bảo các flow chính đã có thể chạy end-to-end, sẵn sàng cho việc kiểm thử thực tế.", "status": "pending", "timeframe": "Tháng 4 - Đầu Tháng 5", "priority": "medium"}, {"title": "UAT & App Store Release", "shortDesc": "Conduct UAT testing and prepare for App Store / Google Play release", "fullDesc": "Tiến hành UAT với các bên liên quan. Ghi nhận và xử lý triệt để issue. Hoàn tất các bước chuẩn bị (metadata, screenshots) để release đúng hạn Go-Live.", "status": "milestone", "timeframe": "Trước Cuối Tháng 5", "priority": "high"}]'::jsonb,
    '[{"title": "Thay Đổi Phạm Vi", "description": "Việc liên tục tinh chỉnh dựa trên phản hồi có thể dẫn đến một vài sai lệch nhỏ so với định cấu trúc ban đầu.", "category": "risk"}, {"title": "Đồng Bộ Giao Diện", "description": "Cần liên tục đối chiếu để đảm bảo giao diện app thực tế bám sát đúng với UI component chuẩn trên Figma.", "category": "dependency"}, {"title": "Tính Liên Tục", "description": "Đội ngũ thiết kế và lập trình cần giữ nhịp đồng bộ để xử lý feedback nhanh mà không bị nghẽn trễ.", "category": "note"}]'::jsonb,
    'System'
)
ON CONFLICT (project_id, week_number) DO NOTHING;

-- Week 2 report
WITH w4s AS (SELECT id FROM projects WHERE slug = 'w4s')
INSERT INTO weekly_reports (
    project_id, week_number, week_start, week_end,
    overall_progress, overall_status, summary,
    ongoing_activities, parallel_workstreams, achievements, next_actions, risks,
    updated_by
)
VALUES (
    (SELECT id FROM w4s),
    2,
    '2026-04-04',
    '2026-04-11',
    50,
    'on-track',
    'Team đã hoàn thành giai đoạn thiết kế Figma và review Figma. Hiện tại team đang tiến hành điều chỉnh lại giao diện ứng dụng theo Figma đã duyệt. Chi tiết tiến độ từng hạng mục có thể theo dõi tại: https://docs.google.com/spreadsheets/d/1ReoCJAoM5RloO-hKg1TB8DBDKpU4TpE9mjDgZqlT2rM/edit?usp=sharing

Dự kiến ngày 20/04 sẽ hoàn thành ứng dụng và tiến hành bàn giao test.

Song song đó, phía W4S cần hoàn thành đăng ký tài khoản App Store Developer và Google Play Developer để sẵn sàng đưa app lên store. W4S cam kết hoàn thành trong Tuần 3.',
    '["Điều chỉnh giao diện app theo Figma đã duyệt", "Đối chiếu từng hạng mục UI với thiết kế chuẩn", "Chuẩn bị môi trường test cho bàn giao", "[W4S] Đăng ký tài khoản App Store Developer & Google Play Developer"]'::jsonb,
    '[{"name": "Điều Chỉnh UI", "icon": "smartphone", "steps": ["Đối chiếu Figma", "Cập nhật giao diện", "Kiểm tra lại"]}, {"name": "Chuẩn Bị Test", "icon": "activity", "steps": ["Setup môi trường", "Viết test case", "Bàn giao"]}, {"name": "Đăng Ký Store (W4S)", "icon": "rocket", "steps": ["Đăng ký Apple Developer", "Đăng ký Google Play", "Xác minh tài khoản"]}]'::jsonb,
    '["Hoàn thành 100% thiết kế Figma và đóng băng design", "Hoàn tất review Figma với tất cả các bên liên quan", "Bắt đầu giai đoạn điều chỉnh giao diện app theo Figma chi tiết", "Báo cáo tiến độ từng hạng mục được cập nhật trên Google Sheets"]'::jsonb,
    '[{"title": "Hoàn thành điều chỉnh UI theo Figma", "shortDesc": "Điều chỉnh toàn bộ giao diện ứng dụng khớp 100% với thiết kế Figma đã duyệt", "fullDesc": "Rà soát và cập nhật từng màn hình, component trong ứng dụng để đảm bảo khớp hoàn toàn với Figma. Chi tiết từng hạng mục theo dõi tại Google Sheets.", "status": "in-progress", "timeframe": "04/04 - 20/04", "priority": "high"}, {"title": "Bàn giao test", "shortDesc": "Bàn giao ứng dụng hoàn chỉnh cho team test nghiệm thu", "fullDesc": "Sau khi hoàn tất điều chỉnh UI, tiến hành bàn giao cho team test. Cung cấp test case, môi trường test và hướng dẫn sử dụng.", "status": "pending", "timeframe": "20/04", "priority": "high"}, {"title": "Release test nghiệp vụ", "shortDesc": "Deliver final testing version covering all business functionalities", "fullDesc": "Phát hành bản test hoàn chỉnh cho toàn bộ các chức năng nghiệp vụ. Đảm bảo các flow chính đã có thể chạy end-to-end.", "status": "pending", "timeframe": "Tháng 4 - Đầu Tháng 5", "priority": "medium"}, {"title": "[W4S] Đăng ký tài khoản Store", "shortDesc": "W4S hoàn thành đăng ký Apple Developer & Google Play Developer", "fullDesc": "Phía W4S cần đăng ký và xác minh tài khoản App Store Developer (Apple) và Google Play Developer (Google) để sẵn sàng cho việc publish app lên store. Đây là bước bắt buộc và cần hoàn thành trước khi release. W4S cam kết hoàn thành trong Tuần 3.", "status": "pending", "timeframe": "Tuần 3 (W4S)", "priority": "high"}, {"title": "UAT & App Store Release", "shortDesc": "Conduct UAT testing and prepare for App Store / Google Play release", "fullDesc": "Tiến hành UAT với các bên liên quan. Ghi nhận và xử lý triệt để issue. Hoàn tất các bước chuẩn bị để release đúng hạn Go-Live.", "status": "milestone", "timeframe": "Trước Cuối Tháng 5", "priority": "high"}]'::jsonb,
    '[{"title": "Sai lệch UI", "description": "Một số component có thể chưa khớp 100% do khác biệt giữa thiết kế tĩnh và môi trường thực tế, cần rà soát kỹ từng màn hình.", "category": "risk"}, {"title": "Tiến độ hạng mục", "description": "Cần theo dõi sát tiến độ từng hạng mục trên Google Sheets để đảm bảo hoàn thành đúng deadline 20/04.", "category": "dependency"}, {"title": "Tài khoản Store (W4S)", "description": "W4S cần hoàn thành đăng ký tài khoản App Store Developer và Google Play Developer trước Tuần 3. Đây là điều kiện bắt buộc để publish app lên store.", "category": "dependency"}, {"title": "Bàn giao test", "description": "Chuẩn bị sẵn test case và môi trường test để quá trình bàn giao diễn ra suôn sẻ ngay khi UI hoàn tất.", "category": "note"}]'::jsonb,
    'System'
)
ON CONFLICT (project_id, week_number) DO NOTHING;
