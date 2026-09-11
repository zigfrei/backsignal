export type CallBackFormField = {
  name: string;
  email: string;
  phone: string;
  policyAgreed: boolean;
  message: string;
};

export type CertificateCallBackFormField = {
  name: string;
  email: string;
  phone: string;
  company: string;
  policyAgreed: boolean;
  message: string;
};

export type QuizFormField = {
  email: string;
  phone: string;
  policyAgreed: boolean;
  quizAnswers: Record<string, string>;
};