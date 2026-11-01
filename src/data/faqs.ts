/** Answers intentionally avoid implying unverified certifications or service guarantees. */
export const faqs = [
    {
        question: "Can O24 be deployed on-premises?",
        answer: "On-premises and cloud deployment are part of the O24 solution discussion. The appropriate deployment model depends on your infrastructure, security requirements, and the components included in your implementation.",
    },
    {
        question: "Can O24 integrate with an existing core banking system?",
        answer: "O24 is designed around API and service integration patterns. The integration approach for a particular core banking platform depends on its available interfaces, authentication methods, and project scope. Contact the team to review your target system.",
    },
    {
        question: "How are security requirements addressed?",
        answer: "Security should be assessed against the architecture and configuration of each deployment. Discuss authentication, authorization, secrets management, transport security, audit logging, and compliance requirements with the team before production rollout.",
    },
    {
        question: "How long does an O24 implementation take?",
        answer: "Timelines vary by deployment environment, integration complexity, testing requirements, and organizational approvals. A technical scoping discussion is the best way to establish a realistic delivery plan.",
    },
    {
        question: "What about availability, support, and SLAs?",
        answer: "Availability targets, operational support, and service-level commitments depend on the proposed architecture and agreed commercial terms. These details should be confirmed in the relevant proposal or service agreement.",
    },
    {
        question: "How can developers and enterprise teams get started?",
        answer: "Developers can explore the available developer resources and solution architecture. Enterprise teams can request a demo to review use cases, deployment options, and next steps with the vKnight team.",
    },
] as const;
