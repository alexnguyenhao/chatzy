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
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // TODO: Implement reset password logic with token
    console.log("Reset password:", { token, password: formData.password });

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1000);
  };

  if (isSuccess) {
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
              Mật khẩu đã được đặt lại!
            </CardTitle>
            <CardDescription className="text-base">
              Bạn có thể đăng nhập với mật khẩu mới
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Button
              onClick={() => navigate("/signin")}
              className="w-full bg-instagram-gradient hover:opacity-90 text-white"
            >
              Đăng nhập ngay
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-instagram-gradient p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold text-destructive">
              Link không hợp lệ
            </CardTitle>
            <CardDescription>
              Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Button
              onClick={() => navigate("/forgot-password")}
              className="w-full bg-instagram-gradient hover:opacity-90 text-white"
            >
              Yêu cầu link mới
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
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Đặt lại mật khẩu</CardTitle>
          <CardDescription className="text-base">
            Nhập mật khẩu mới cho tài khoản của bạn
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu mới</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="h-11"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
                className="h-11"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-xs text-muted-foreground">💡 Mật khẩu nên:</p>
              <ul className="text-xs text-muted-foreground mt-1 list-disc list-inside space-y-0.5">
                <li>Có ít nhất 6 ký tự</li>
                <li>Kết hợp chữ và số</li>
                <li>Bao gồm ký tự đặc biệt</li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Button
              type="submit"
              className="w-full h-11 bg-instagram-gradient hover:opacity-90 transition-opacity text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
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
