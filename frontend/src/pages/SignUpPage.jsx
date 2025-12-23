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

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    // TODO: Implement registration logic
    console.log("SignUp:", formData);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-instagram-gradient-reverse p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-instagram-gradient rounded-2xl flex items-center justify-center">
              <span className="text-3xl font-bold text-white">C</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-instagram-gradient bg-clip-text text-transparent">
            Tạo tài khoản ChatZy
          </CardTitle>
          <CardDescription className="text-base">
            Tham gia cộng đồng chat của chúng tôi
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
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
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
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

            <p className="text-xs text-muted-foreground text-center">
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <a href="#" className="text-instagram-purple hover:underline">
                Điều khoản dịch vụ
              </a>{" "}
              và{" "}
              <a href="#" className="text-instagram-purple hover:underline">
                Chính sách bảo mật
              </a>
            </p>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full h-11 bg-instagram-gradient hover:opacity-90 transition-opacity text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>

            <div className="text-center text-sm">
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="text-instagram-purple hover:text-instagram-pink font-semibold transition-colors"
              >
                Đăng nhập
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
