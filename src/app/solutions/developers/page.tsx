import { Metadata } from "next";
import DevelopersClient from "./DevelopersClient";

export const metadata: Metadata = {
    title: "Dành cho Lập trình viên | vKnight O24 Developer Portal",
    description: "Xây dựng ứng dụng tài chính nhanh hơn với SDK đa ngôn ngữ, tài liệu API chi tiết và môi trường Sandbox miễn phí.",
    openGraph: {
        title: "Dành cho Lập trình viên | vKnight O24 Developer Portal",
        description: "Xây dựng ứng dụng tài chính nhanh hơn với SDK đa ngôn ngữ, tài liệu API chi tiết và môi trường Sandbox miễn phí.",
        url: "/solutions/developers",
    },
};

export default function DevelopersPage() {
    return <DevelopersClient />;
}
