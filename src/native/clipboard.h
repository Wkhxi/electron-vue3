// 头文件 包含声明和定义，不包含具体的实现代码
// 在编译器编译源代码时，包含了头文件的源代码会先被预处理器处理，然后将编译后的对象代码和库链接起来生成可执行文件。
// 例如 引用头文件 #include <stdio.h> ，可使用其定义的 printf 函数

// CLIPBOARD_H 如果未被定义 则 定义 CLIPBOARD_H
// 确保头文件只被包含一次
#ifndef CLIPBOARD_H
#define CLIPBOARD_H

#include <vector>
#include <string>

std::vector<std::string> ReadFilePaths();

#endif