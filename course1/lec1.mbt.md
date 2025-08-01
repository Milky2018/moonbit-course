---
marp: true
math: mathjax
paginate: true
backgroundImage: url('../pics/background_moonbit.png')
style: |
    ol > li {
        list-style-type:decimal
    }
---

# 现代编程思想

## 课程介绍 & 程序设计

### 月兔公开课课程组

---

# 致谢

本课程参考[宾夕法尼亚大学CIS1200课程](https://www.seas.upenn.edu/~cis120/current/)设计

---

# 什么是**现代编程思想课**

- 这是一门**程序设计**课
    - 课程受众：所有编程爱好者
- 实用技巧
    - 编写较大型程序（～10,000行）
    - 独立分析解决问题
    - 测试驱动开发与设计
- 概念基础
    - 常见数据结构与算法
    - 多种编程范式
    - 关注模块化和组合性
    
---

# 课程工具
- MoonBit月兔
    - 现代静态类型**多范式**编程语言
    - 语法轻量，易上手
    - 浏览器开发环境、云原生开发环境或本地集成开发环境

---
# 课程概览

$$
\begin{array} {|c|c|c|c|}
 \text{课程} & \text{主题} & \text{课程} & \text{主题} \\
 \hline
 1 & \text{课程介绍与程序设计} &  8 & \text{队列：可变数据实现} \\
 2 & \text{月兔中的表达式} & 9 & \text{特征 / 接口} \\
 3 & \text{函数, 列表与递归} & 10 & \text{哈希表与闭包} \\
 4 & \text{多元组、结构体、枚举类型、错误处理} & 11 & \text{案例：语法解析器}\\
 5 & \text{树} & 12 & \text{案例：自动微分} \\
 6 & \text{泛型与高阶函数} & 13 & \text{案例： 基于梯度下降的神经网络} \\
 7 & \text{命令式编程} & 14 & \text{案例：TODO MVC} \\
\end{array}
$$

- 所有课程资料均在互联网上公开


--- 
# 程序设计

---
# 基础设计流程
**设计**是将非正式的规范转化为可运行代码的过程

推荐采用由测试驱动的开发流程

1. 理解问题
    涉及哪些概念，它们之间存在怎样的联系？
2. 定义接口
    程序应当如何与环境互动？
3. 写测试案例
    对于典型输入，程序应当如何表现？对于非正常输入呢？
4. 实现规定的行为
    经常需要将问题分解为更简单的子问题并对各子问题重复以上流程
---
# 一个设计例题

> 超市正在促销，你可以用 `num_exchange` 个空水瓶从超市兑换一瓶水。最开始，你一共购入了 `num_bottles` 瓶水。
> 如果喝掉了水瓶中的水，那么水瓶就会变成空的。
> 给你两个整数 `num_bottles` 和 `num_exchange` ，返回你**最多**可以喝到多少瓶水。
> ——[力扣1518](https://leetcode.cn/problems/water-bottles/)

---

# 步骤1：理解问题

- 涉及到哪些概念
    - 满水瓶：可以直接喝的水瓶
    - 空水瓶：喝完后的空瓶，可以用于兑换
    - 总水瓶数：累计喝掉的水瓶数量
- 它们之间的关系怎样？
    - 初始拥有满水瓶数为 `num_bottles`，空水瓶数和总水瓶数为 0
    - 喝掉所有满水瓶后，得到等量空瓶，增加总水瓶数
    - 每 `num_exchange` 个空瓶可以兑换一瓶满水瓶
    - 重复此过程直到空瓶不足以兑换
- 我们要取得什么？
    - 给定初始满水瓶数 `num_bottles` 和交换条件`num_exchange`，计算最多喝几瓶
---

# 步骤二：定义接口

> 给你两个整数 `num_bottles` 和 `num_exchange` ，返回你**最多**可以喝到多少瓶水。

```moonbit
fn num_water_bottles_(num_bottles: Int, num_exchange: Int) -> Int {
    ...
}
```

---

# 步骤三：写测试案例

```moonbit
test {
  assert_eq(num_water_bottles_(9, 3), 13) // 9 + 3 + 1 = 13
  assert_eq(num_water_bottles_(15, 4), 19)
}
```

---

# 步骤四：实现程序

一个可能的实现

```moonbit
fn num_water_bottles(num_bottles : Int, num_exchange : Int) -> Int {
  for num_full = num_bottles, num_empty = 0, num_total = 0 {
    if num_full > 0 {
      continue 0, num_empty + num_full, num_total + num_full
    } else if num_empty > num_exchange {
      continue num_empty / num_exchange, num_empty % num_exchange, num_total
    } else {
      break num_total
    }
  }
}

// 省略测试代码
```

---

# 小练习

- 案例代码只实现了对于理想的输入的计算。对于非正常输入会出现错误。你能找到这样的非正常输入吗？
    - 提示：在月兔中，Int值域为-2,147,483,648到+2,147,483,647

---

# 总结

- 我们希望推动大家采取迭代的设计流程
    1. 理解问题
    2. 定义接口
    3. 定义测试案例
    4. 实现期望的行为

- 现代软件开发依赖**测试驱动开发**
    - 在开发流程中尽早定义测试案例并用它们指导剩余的开发流程
