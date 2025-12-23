import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement forgot password logic
    console.log("Forgot password:", email);

    setTimeout(() => {
      setIsLoading(false);
      setIsEmailSent(true);
    }, 1000);
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-instagram-gradient p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              Email đã được gửi!
            </CardTitle>
            <CardDescription className="text-base">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến{" "}
              <strong>{email}</strong>
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Kiểm tra hộp thư đến (và cả spam) của bạn
            </p>
            <Button
              onClick={() => navigate("/signin")}
              className="w-full bg-instagram-gradient hover:opacity-90 text-white"
            >
              Quay lại đăng nhập
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-instagram-gradient p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Quên mật khẩu?</CardTitle>
          <CardDescription className="text-base">
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full h-11 bg-instagram-gradient hover:opacity-90 transition-opacity text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Đang gửi..." : "Gửi email đặt lại"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/signin")}
              className="w-full"
            >
              ← Quay lại đăng nhập
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
