---
description: Quy trình quản lý code chuẩn công ty với Git
---

# 🌳 Git Workflow - Chuẩn Công Ty

## Cấu Trúc Branches

```
main (production - code stable)
  └── develop (phát triển chính)
      ├── feature/tên-tính-năng
      ├── bugfix/tên-lỗi
      └── hotfix/lỗi-khẩn-cấp
```

## Quy Ước Đặt Tên Nhánh

- `main` - Code production, luôn stable, chỉ merge từ develop hoặc hotfix
- `develop` - Nhánh phát triển chính, tích hợp tất cả features
- `feature/[tên]` - Phát triển tính năng mới (ví dụ: `feature/chat-realtime`)
- `bugfix/[tên]` - Sửa bug (ví dụ: `bugfix/login-error`)
- `hotfix/[tên]` - Sửa lỗi khẩn cấp trên production (ví dụ: `hotfix/payment-crash`)

---

## 📝 Conventional Commits

Format: `<type>(<scope>): <subject>`

### Types:

- `feat` - Tính năng mới
- `fix` - Sửa bug
- `docs` - Thay đổi documentation
- `style` - Format code, không ảnh hưởng logic
- `refactor` - Refactor code
- `perf` - Cải thiện performance
- `test` - Thêm hoặc sửa tests
- `chore` - Cập nhật dependencies, config
- `ci` - Thay đổi CI/CD

### Ví dụ:

```bash
git commit -m "feat(chat): add realtime messaging with socket.io"
git commit -m "fix(auth): resolve token expiration issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(api): extract common middleware"
```

---

## 🔄 Workflow Hoàn Chỉnh

### 1. Bắt Đầu Task Mới

```bash
# Cập nhật develop mới nhất
git checkout develop
git pull origin develop

# Tạo nhánh feature/bugfix
git checkout -b feature/ten-tinh-nang
```

### 2. Làm Việc & Commit

```bash
# Thêm files đã thay đổi
git add <files>

# Hoặc thêm tất cả
git add .

# Commit với message rõ ràng
git commit -m "feat(module): mô tả ngắn gọn"

# Có thể commit nhiều lần trong quá trình làm
```

### 3. Push Lên Remote

```bash
# Lần đầu tiên push nhánh mới
git push -u origin feature/ten-tinh-nang

# Các lần sau
git push
```

### 4. Tạo Pull Request (PR)

1. Lên GitHub → Tab "Pull Requests" → "New Pull Request"
2. Chọn: `feature/ten-tinh-nang` → `develop`
3. Điền tiêu đề và mô tả chi tiết:
   - Làm gì?
   - Tại sao?
   - Test như thế nào?
4. Request review (nếu có team)
5. Đợi approval và merge

### 5. Sau Khi Merge

```bash
# Về lại develop
git checkout develop

# Pull code mới nhất (đã có feature vừa merge)
git pull origin develop

# Xóa nhánh feature local (đã không cần)
git branch -d feature/ten-tinh-nang

# Xóa nhánh remote (optional)
git push origin --delete feature/ten-tinh-nang
```

### 6. Release Lên Production

```bash
# Khi develop đã stable và sẵn sàng release
git checkout main
git merge develop
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags
```

---

## 🔥 Xử Lý Tình Huống Thực Tế

### Conflict Khi Merge

```bash
# Khi tạo PR bị conflict
git checkout feature/ten-cua-ban
git pull origin develop

# Giải quyết conflicts trong editor
# Sau khi resolve xong:
git add .
git commit -m "chore: resolve merge conflicts"
git push
```

### Sửa Commit Message Vừa Tạo

```bash
# Chưa push
git commit --amend -m "feat(chat): message mới đúng hơn"

# Đã push (cẩn thận!)
git commit --amend -m "feat(chat): message mới"
git push --force-with-lease
```

### Cập Nhật Nhánh Feature Với Develop Mới Nhất

```bash
git checkout feature/ten-cua-ban
git pull origin develop --rebase
# Hoặc
git merge develop
```

### Hotfix Khẩn Cấp

```bash
# Tạo từ main
git checkout main
git checkout -b hotfix/loi-nguy-hiem

# Fix và commit
git commit -m "hotfix(payment): fix critical payment error"

# Merge vào cả main và develop
git checkout main
git merge hotfix/loi-nguy-hiem
git push origin main

git checkout develop
git merge hotfix/loi-nguy-hiem
git push origin develop

git branch -d hotfix/loi-nguy-hiem
```

---

## ✅ Best Practices

1. **Commit thường xuyên** - Mỗi thay đổi logic nên có 1 commit
2. **Pull trước khi push** - Tránh conflicts
3. **Không commit trực tiếp vào main/develop** - Luôn dùng feature branches
4. **Viết commit message rõ ràng** - Người khác đọc hiểu được
5. **Review code trước khi merge** - Đảm bảo chất lượng
6. **Xóa branches đã merge** - Giữ repo sạch sẽ
7. **Không force push** - Trừ khi thực sự cần thiết
8. **Tag các phiên bản release** - Dễ theo dõi lịch sử

---

## 🎯 Ví Dụ Cụ Thể

### Task: "Thêm tính năng chat realtime"

```bash
# 1. Setup
git checkout develop
git pull origin develop
git checkout -b feature/realtime-chat

# 2. Implement socket.io server
# ... code ...
git add backend/src/socket/chat.js
git commit -m "feat(chat): setup socket.io server connection"

# 3. Create chat UI
# ... code ...
git add frontend/src/components/Chat.jsx
git commit -m "feat(chat): create chat UI component"

# 4. Add message persistence
# ... code ...
git add backend/src/models/Message.js
git commit -m "feat(chat): add message model and save to DB"

# 5. Push và tạo PR
git push -u origin feature/realtime-chat
# Lên GitHub tạo PR: feature/realtime-chat → develop

# 6. Sau khi merge
git checkout develop
git pull origin develop
git branch -d feature/realtime-chat
```

---

## 📚 Tài Liệu Tham Khảo

- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
