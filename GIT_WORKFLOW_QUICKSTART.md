# 🚀 Quick Start Guide - Git Workflow

Này là ví dụ nhanh về cách làm việc với Git workflow chuẩn công ty.

## Các Bước Cơ Bản

### 1. Bắt đầu task mới

```bash
git checkout develop
git pull origin develop
git checkout -b feature/ten-task
```

### 2. Code và commit

```bash
git add .
git commit -m "feat(module): mô tả thay đổi"
```

### 3. Push và tạo PR

```bash
git push -u origin feature/ten-task
# Lên GitHub tạo Pull Request
```

### 4. Sau khi merge

```bash
git checkout develop
git pull origin develop
git branch -d feature/ten-task
```

Xem chi tiết tại [Git Workflow](.agent/workflows/git-workflow.md)
