#include <napi.h>
#include <tuple>
#include "clipboard.h"


// 由 Node.js 传入 传入一个 CallbackInfo 类型的参数
// 该对象包含 JavaScript 调用此方法时的输入参数，可以通过这个对象的 Env 方法获取 JavaScript 运行时环境对象
Napi::Array ReadFilePathsJs(const Napi::CallbackInfo &info)
{
  auto env = info.Env();

  // 返回一个字符串容器 std::vector<std::string>类型
  // 容器中的内容就是剪切板内的文件路径
  const auto file_paths = ReadFilePaths();
  auto result = Napi::Array::New(env, file_paths.size());

  // 这个容器中的内容逐一复制到一个数组中
  // Napi::Array 类型，这个类型可以直接被 JavaScript 访问
  for (size_t i = 0; i != file_paths.size(); ++i)
  {
    result.Set(i, file_paths[i]);
  }
  return result;

}


// env 和 exports 两个参数， Node.js 调用此函数时会输入这两个参数
// env JavaScript 运行时环境对象
// exports 模块的导出对象 module.exports
Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    // 给这个对象设置属性，以导出我们想要暴露给外部的内容
    // 当外部调用此方法时，将执行 ReadFilePathsJs 函数
    exports.Set("readFilePaths", Napi::Function::New(env, ReadFilePathsJs));

    // 入口函数退出时应把 exports 对象返回给调用方
    return exports;
}

// NODE_API_MODULE 这个宏方法定义此原生模块的入口函数
// 一旦 Node.js 加载该模块时，将执行 Init 方法
// NODE_GYP_MODULE_NAME 宏展开后为编译配置文件 binding.gyp 中的 target_name
NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);

// NODE_API_MODULE 是 Node.js 提供的 C/C++ 扩展机制，它提供了一种创建 Node.js 模块的方式，使得开发者可以在 C/C++ 中编写高效的系统性能依赖模块，然后在 Node.js 中使用它们。
// 在 C/C++ 中编写扩展代码，连接标准 Node.js 模块和 Node.js API，并通过调用 node-gyp 来生成模块二进制文件。这些二进制文件可以通过在 Node.js 中的 require() 函数引用并使用。

// NODE_GYP_MODULE_NAME 是 Node.js 扩展的宏常量

// #include <napi.h> 是 C++ Node.js addons 中常用的头文件，其中包含了 Node.js API 的声明和定义。使用这个头文件可以方便地在 C++ 中编写 Node.js addons。
// Napi::Object、Napi::Function、Napi::Array、Napi::String 等类都是这个头文件中常用的类。通过这些类，开发者可以创建 JavaScript 对象、函数、数组和字符串，并很容易地将它们导出到 Node.js 中供 JavaScript
