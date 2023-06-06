// windows平台实现

#include <Windows.h>
#include <ShlObj.h>
#include <memory>
#include "clipboard.h"


// 宽字符串 转 UTF8字符串
std::string Utf16CStringToUtf8String(LPCWSTR input, UINT len)
{
  int target_len = WideCharToMultiByte(CP_UTF8, 0, input, len, NULL, 0, NULL, NULL);
  std::string result(target_len, '\0');
  WideCharToMultiByte(CP_UTF8, 0, input, len, result.data(), target_len, NULL, NULL);
  return result;
}

class ClipboardScope
{

  bool valid;

  public:

    // 对象初始化时 执行 OpenClipboard
    ClipboardScope()
    {
        valid = static_cast<bool>(OpenClipboard(NULL));
    }
    // 析构函数 对象销毁时 执行 CloseClipboard
    ~ClipboardScope()
    {
        CloseClipboard();
    }

    bool IsValid()
    {
        return valid;
    }
};


//读取剪切板内的文件路径
std::vector<std::string> ReadFilePaths()
{
  auto result = std::vector<std::string>();
  ClipboardScope clipboard_scope;
  if (!clipboard_scope.IsValid())
  {
      return result;
  }
  HDROP drop_files_handle = (HDROP)GetClipboardData(CF_HDROP);
  if (!drop_files_handle)
  {
      return result;
  }
  UINT file_count = DragQueryFileW(drop_files_handle, 0xFFFFFFFF, NULL, 0);
  result.reserve(file_count);
  for (UINT i = 0; i < file_count; ++i)
  {
      UINT path_len = DragQueryFileW(drop_files_handle, i, NULL, 0);
      UINT buffer_len = path_len + 1;
      std::unique_ptr<WCHAR[]> buffer(new WCHAR[buffer_len]);
      path_len = DragQueryFileW(drop_files_handle, i, buffer.get(), buffer_len);
      result.emplace_back(Utf16CStringToUtf8String(buffer.get(), path_len));
  }
  return result;
}