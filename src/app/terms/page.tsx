export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-16 lg:py-24">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Điều khoản Dịch vụ</h1>
                    <p className="text-sm text-muted-foreground">Cập nhật lần cuối: 15/10/2023</p>
                </div>

                <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p>
                        Chào mừng bạn đến với <strong>vKnight</strong>. Bằng việc truy cập hoặc sử dụng trang web, API, hoặc bất kỳ dịch vụ nào của chúng tôi, bạn đồng ý tuân thủ các Điều khoản Dịch vụ này.
                    </p>

                    <h3>1. Tài khoản và Đăng ký</h3>
                    <p>
                        Để sử dụng dịch vụ, bạn cần đăng ký một tài khoản vKnight. Bạn cam kết rằng:
                    </p>
                    <ul>
                        <li>Thông tin cung cấp là chính xác, đầy đủ và cập nhật.</li>
                        <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập (API Key, mật khẩu) của mình.</li>
                        <li>Thông báo ngay cho chúng tôi nếu phát hiện bất kỳ hành vi truy cập trái phép nào.</li>
                    </ul>

                    <h3>2. Quy định sử dụng API</h3>
                    <p>
                        Việc sử dụng API của vKnight phải tuân thủ các nguyên tắc sau:
                    </p>
                    <ul>
                        <li><strong>Giới hạn truy cập (Rate Limiting):</strong> Bạn phải tuân thủ các giới hạn số lượng yêu cầu (request) theo gói dịch vụ đã đăng ký.</li>
                        <li><strong>Mục đích hợp pháp:</strong> Không sử dụng dịch vụ cho bất kỳ hoạt động phi pháp, lừa đảo hoặc gây hại nào.</li>
                        <li><strong>Bảo mật:</strong> Không tìm cách đảo ngược (reverse engineer), tấn công hoặc làm gián đoạn hệ thống của chúng tôi.</li>
                    </ul>

                    <h3>3. Thanh toán và Chi phí</h3>
                    <ul>
                        <li>Dịch vụ được tính phí theo gói bạn đã chọn (Tháng/Năm) hoặc theo mức sử dụng thực tế (Pay-as-you-go).</li>
                        <li>Phí dịch vụ không bao gồm các khoản thuế hiện hành trừ khi có quy định khác.</li>
                        <li>Chúng tôi có quyền điều chỉnh bảng giá với thông báo trước ít nhất 30 ngày.</li>
                    </ul>

                    <h3>4. Sở hữu trí tuệ</h3>
                    <p>
                        Nền tảng vKnight, bao gồm mã nguồn, tài liệu, giao diện và thương hiệu, là tài sản trí tuệ độc quyền của chúng tôi. Bạn được cấp quyền sử dụng không độc quyền, có thể thu hồi để truy cập dịch vụ theo các điều khoản này.
                    </p>

                    <h3>5. Giới hạn trách nhiệm</h3>
                    <p>
                        Trong giới hạn tối đa cho phép của pháp luật, vKnight sẽ không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp (mất lợi nhuận, dữ liệu, hoặc gián đoạn kinh doanh) phát sinh từ việc sử dụng dịch vụ của chúng tôi. Trách nhiệm đền bù tối đa của chúng tôi sẽ không vượt quá số tiền bạn đã trả cho dịch vụ trong 12 tháng gần nhất (nếu có).
                    </p>

                    <h3>6. Chấm dứt dịch vụ</h3>
                    <p>
                        Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản của bạn nếu phát hiện vi phạm nghiêm trọng các điều khoản này (ví dụ: tấn công DDoS, sử dụng thẻ tín dụng đánh cắp). Bạn cũng có thể hủy dịch vụ bất cứ lúc nào thông qua trang quản trị.
                    </p>

                    <h3>7. Luật áp dụng</h3>
                    <p>
                        Các điều khoản này được điều chỉnh và giải thích theo pháp luật của Cộng hòa Xã hội Chủ nghĩa Việt Nam. Mọi tranh chấp sẽ được giải quyết tại tòa án có thẩm quyền tại TP. Hồ Chí Minh.
                    </p>

                    <h3>8. Liên hệ</h3>
                    <p>
                        Mọi thắc mắc về Điều khoản Dịch vụ, vui lòng liên hệ:<br />
                        Email: <a href="mailto:legal@vknight.io.vn">legal@vknight.io.vn</a><br />
                        Địa chỉ: Khu nhà cao cấp C13/19 thuộc Cư xá Phú Lâm B, Quận 6, TP.HCM
                    </p>
                </div>
            </div>
        </div>
    );
}
