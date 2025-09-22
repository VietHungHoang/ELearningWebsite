# Test Lesson Progress Logic

## Các thay đổi đã thực hiện:

### 1. Sửa `updateLessonProgress` function:
- **Trước**: Tìm section dựa trên `currentLesson.id` (có thể không chính xác)
- **Sau**: Tìm section dựa trên `lessonId` được truyền vào (chính xác hơn)
- **Cải thiện**: Cập nhật progress cho TẤT CẢ sections, không chỉ current section
- **Thêm**: Sync `currentLesson` state sau khi cập nhật

### 2. Thêm useEffect để sync state:
- Sync `currentLesson` với `courseData` khi `courseData` thay đổi
- Đảm bảo UI luôn hiển thị đúng trạng thái

### 3. Cải thiện debug logging:
- Thêm nhiều log để debug dễ hơn
- Log lesson ID và section ID để track chính xác

## Cách test:

1. **Mở browser console** để xem debug logs
2. **Chọn một lesson** trong sidebar
3. **Xem video đến cuối** (hoặc skip đến cuối)
4. **Kiểm tra**:
   - Console có log "handleVideoEnd called"
   - Console có log "handleLessonCompletion called"
   - Console có log "updateLessonProgress called"
   - Sidebar cập nhật lesson thành completed (checkmark xanh)
   - Progress bar cập nhật
   - Next lesson modal xuất hiện

## Debug logs cần chú ý:

```
DEBUG: handleVideoEnd called for lesson: [Lesson Title] ID: [Lesson ID]
DEBUG: courseData exists: true
DEBUG: handleLessonCompletion called for lesson: [Lesson Title] ID: [Lesson ID]
DEBUG: updateLessonProgress called for lesson: [Lesson ID] completed: true
DEBUG: Target section ID: [Section ID]
DEBUG: Updating lesson: [Lesson ID] in section: [Section ID] to completed: true
DEBUG: Updating progress for section: [Section ID] completed: [X] total: [Y]
```

## Nếu vẫn không hoạt động:

1. Kiểm tra xem `onVideoEnd` có được gọi không
2. Kiểm tra xem `currentLesson` có đúng không
3. Kiểm tra xem `courseData` có tồn tại không
4. Kiểm tra xem lesson ID có match không
