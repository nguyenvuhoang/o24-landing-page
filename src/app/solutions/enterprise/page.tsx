import { Metadata } from "next";
import EnterpriseSolutionClient from "./EnterpriseSolutionClient";

export const metadata: Metadata = {
    title: "Giải pháp cho Doanh nghiệp | vKnight O24 Platform",
    description: "Quản trị tập trung, bảo mật doanh nghiệp và khả năng triển khai Hybrid/On-premise cho các tổ chức quy mô lớn.",
    openGraph: {
        title: "Giải pháp cho Doanh nghiệp | vKnight O24 Platform",
        description: "Quản trị tập trung, bảo mật doanh nghiệp và khả năng triển khai Hybrid/On-premise cho các tổ chức quy mô lớn.",
        url: "/solutions/enterprise",
    },
};

export default function EnterpriseSolutionPage() {
    return <EnterpriseSolutionClient />;
}
