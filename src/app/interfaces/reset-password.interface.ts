interface OtpRequest {
  email: string;
}

interface OtpVerificationRequest {
  email: string;
  otp: string;
}

interface PasswordResetRequest {
  email: string;
  newPassword: string;
  otp: string;
}
