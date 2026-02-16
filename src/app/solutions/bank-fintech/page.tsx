import { Metadata } from "next";
import BankFintechClient from "./BankFintechClient";

export const metadata: Metadata = {
    title: "Giải pháp Ngân hàng & Fintech | vKnight O24",
    description: "Tích hợp Core Banking, xử lý giao dịch real-time và tuân thủ bảo mật PCI-DSS với nền tảng O24.",
    openGraph: {
        title: "Giải pháp Ngân hàng & Fintech | vKnight O24",
        description: "Tích hợp Core Banking, xử lý giao dịch real-time và tuân thủ bảo mật PCI-DSS với nền tảng O24.",
        url: "/solutions/bank-fintech",
    },
};

export default function BankFintechPage() {
    return <BankFintechClient />;
}
