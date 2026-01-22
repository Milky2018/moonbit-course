---
marp: true
math: mathjax
paginate: true
backgroundImage: url('../pics/background_moonbit.png')
headingDivider: 1
---

# 现代编程思想

## 案例：语法解析器

### Hongbo Zhang

<!-- ssml
  大家好，欢迎来到由IDEA研究院基础软件中心为大家带来的现代编程思想公开课。
  经过了十节课的学习，相信大家已经对月兔语言有了初步的了解，也可以尝试挑战一些更为复杂的程序。
  我们将为大家展示一些有趣的案例。
  这届课我们展示的是语法解析器。
  <break time="500ms" />
-->

# 语法解析器

- 案例目标
  - 解析基于自然数的数学表达式：`"(1+ 5) * 7 / 2"`
  - 转化为单词列表
    `LParen Value(1) Plus Value(5) Multiply Value(7) Divide Value(2)`
  - 转化为抽象语法树
    `Division(Multiply(Add(Value(1), Value(5)), Value(7)), Value(2))`
  - 计算最终结果：21
- 语法分析
  - 对输入文本进行分析并确定其语法结构
  - 通常包含**词法分析**和**语法分析**
  - 本节课均利用**语法解析器组合子**（parser combinator）为例

<!-- ssml
  世界上有着种类繁多的语言，以及编程语言，和各类其他的符号语言等等。
  我们今天以自然数的四则运算为例。
  对于一个字符串，首先我们要做的就是分解为单词的列表。
  例如"(1+ 5) * 7 / 2"，我们就可以根据词法分解为左括号、1、加号、5、右括号、乘号、7、除号、2。
  显然，1和括号、加号之间虽然没有空格，应当被拆分为三个单词，这样的规则就是词法。
  这个步骤也就是词法分析。
  在有了单词流之后，我们要根据语法将它组合为一个抽象语法树。
  例如，首先应该有1和5的和，再由这个和与7进行乘法，最后，再由这个乘积与2进行除法，而不是1加上5与7的乘积，因为这不符合语法。
  这个步骤就是语法分析。
  最后，我们要根据语义进行计算。
  例如1+5的语义代表数字1和5进行整数求和。
  语法解析是计算机科学的重要领域，因为所有的编程语言都会需要语法解析来分析源代码并运行，因此也有大量的成熟工具。
  本节课我们则是展现语法解析器组合子，parser combinator，来同时实现这两个部分。
  感兴趣的同学也可以参考最后的推荐书目进行深入学习。
  所有的代码都会在课程网站上公开。
  那就让我们开始吧。
  <break time="500ms" />
-->

# 词法分析

- 将输入分割为单词
  - 输入：字符串/字节块
  - 输出：单词流
  - 例如：`"12 +678"` -> `[ Value(12), Plus, Value(678) ]`
- 算术表达式的词法定义
  ```abnf
  Number     = %x30 / (%x31-39) *(%x30-39)
  LParen     = "("
  RParen     = ")"
  Plus       = "+"
  Minus      = "-"
  Multiply   = "*"
  Divide     = "/"
  ```

<!-- ssml
  首先让我们从词法分析开始。
  我们的目的是把输入分割为单词。
  输入是字符串，输出是单词流。
  例如，"12 +678"应当被分割为整数12、加号、整数678。
  词法分析一般较为简单，通常可以用有限状态自动机完成。
  一般可以通过领域特定语言定义后由软件生成程序，例如lex或flex等。
  我们在这里使用parser combinator。
  首先我们定义算术表达式的词法如下，包含整数、左右括号、四则运算符以及空格。
  <break time="500ms" />
-->

# 词法分析
- 算术表达式的词法定义
  ```abnf
  Number = %x30 / (%x31-39) *(%x30-39)
  Plus   = "+"
  ```
- 每一行对应一个匹配规则
  - `"xxx"`：匹配内容为xxx的字符串
  - `a b`：匹配规则a，成功后匹配规则b
  - `a / b`：匹配规则a，匹配失败则匹配规则b
  - `*a`：重复匹配规则a，可匹配0或多次
  - `%x30`：UTF编码十六进制表示为30的字符（`"0"`）

<!-- ssml
  我们以整数和加号为例。
  词法定义的每一行对应一个匹配规则。
  引号引用的部分代表一字一句地匹配内容相同的字符串。
  规则a空格规则b代表先匹配规则a，如果成功则继续匹配规则b。
  规则a斜杠规则b代表规则a或b，也就是尝试匹配规则a，如果失败则匹配规则b。
  如果在规则前方有星号，代表匹配规则零或多次。
  最后百分号x则代表根据UTF编码匹配字符。
  x代表这里用的是16进制。
  例如0x30匹配的是第48个字符0，对应十六进制为30。
  理解了这些以后我们再来看定义。
  Plus很好理解，对应加号。
  Number则对应零，或者是一个1-9中的字符，之后跟着0或多个0-9的字符。
  <break time="500ms" />
-->

# 词法分析

- 算术表达式的词法定义
  ```abnf
  Number = %x30 / (%x31-39) *(%x30-39)
  Plus   = "+"
  ```
  ![](../pics/lex_rail.drawio.svg)
- 单词定义
  ```moonbit
  enum Token {
    Value(Int); LParen; RParen; Plus; Minus; Multiply; Divide
  } derive(Show)
  ```

<!-- ssml
  大家也可以参考这里的轨道图。
  我们在月兔中利用枚举类型定义单词。
  单词可以是值，其中承载着一个整数，或是左右括号和四则运算符。
  至于空格，我们直接舍去。
  <break time="500ms" />
-->

# 解析器组合子

- 构造可组合的解析器
  ```moonbit
  // V 代表解析成功后获得的值
  // @string.View 代表 String 的一部份
  type Lexer[V] (@string.View) -> (V, @string.View)?

  fn Lexer::parse[V](self : Lexer[V], str : @string.View) -> (V, @string.View)? {
    self.inner()(str)
  }
  ```
  - 我们简化处理报错信息以及错误位置（可以使用`Result[A, B]`）

<!-- ssml
  我们开始构建可组合的解析器。
  解析器的定义是一个函数，输入值是一个字符串，输出则是一个可空类型，空值代表匹配失败，非空时则有一个值以及剩余的字符串。
  按理说，如果匹配失败，应当提供错误信息，例如为什么匹配失败，在哪里匹配失败等。
  这里为了简化起见省略。
  感兴趣的可以使用Result[A, B]类型进行实现。
  我们还提供一个parse方法，方便使用。
  <break time="500ms" />
-->

# 解析器组合子

- 最简单的解析子：判断下一个待读取的字符是否符合条件，符合则读取并前进
  ```moonbit
  fn pchar(predicate : (Char) -> Bool) -> Lexer[Char] {
    Lexer(input => match input {
      [ch, .. rest] if predicate(ch) => Some((ch, rest))
      _ => None
    })
  }
  ```
- 例如：`pchar(ch => ch is 'a').parse("asdf")` => `Some(('a', "sdf"))`；`pchar(...).parse("sdf")` => `None`

<!-- ssml
  我们首先定义一个最简单的解析器，那就是匹配一个字符。
  这个解析器的构造需要一个函数，这个函数被用来判断读到的字符是否符合条件。
  如第3行，如果输入非空，且第一个字符符合我们的条件，那么我们读取这个字符，将这个字符串作为值，一并返回剩下的字符串。
  否则，我们返回空值，表示匹配失败。
  我们在下面的代码中使用这个解析器。
  例如，我们利用一个简单的匿名函数定义了判断是否字符为a的条件。
  我们利用它解析"asdf"这个字符串。
  因为"asdf"以a为开头，因此解析成功，并且我们获得了a和剩下的"sdf"。
  如果我们接着用同样的匿名函数再次匹配剩余的字符串，那么就会失败。
  <break time="500ms" />
-->

# 词法分析

- 单词定义：数字或左右括号或加减乘除
```moonbit
enum Token {
  Value(Int)
  LParen; RParen; Plus; Minus; Multiply; Divide
} derive(Show)
```

- 分析运算符、括号、空白字符等

```moonbit
let symbol: Lexer[Char] =  pchar(ch => ch
  is ('+' | '-' | '*' | '/' | '(' | ')'))
let whitespace : Lexer[Char] = pchar(ch => ch is ' ')
```

<!-- ssml
  利用这一个简单的解析器，我们就已经可以解决大部分单词，包括括号、四则运算符以及空格了。
  我们这里同样利用匿名函数进行定义，在匿名函数中直接进行模式匹配所有的可能性，如果是我们要匹配的则返回true，否则返回false。
  对于空白字符也同样。
  唯一的问题是，单单解析为字符还不够，因为我们想要获得更为具体的枚举值，因此我们需要定义一个映射函数。
  <break time="500ms" />
-->

# 解析器组合子

- 如果解析成功，对解析结果进行转化
```moonbit
fn[I, O] Lexer::map(self : Lexer[I], f : (I) -> O) -> Lexer[O] {
  Lexer(fn(input) { self.parse(input).map(pair => (f(pair.0), pair.1)) })
}
```

- 分析运算符、括号并映射为对应的枚举值

```moonbit
let symbol : Lexer[Token] =
  pchar(ch => ch is ('+' | '-' | '*' | '/' | '(' | ')')).map(ch => match ch {
    '+' => Plus; '-' => Minus; '*' => Multiply; '/' => Divide; '(' => LParen; ')' => RParen
    _ => panic()
  })
```

<!-- ssml
  map可以在解析成功时对解析的结果进行转化。
  它的参数除了本身的解析器外就是一个转化函数。
  我们在第三行结尾利用问号运算符。
  如果解析成功，返回值非空，那么问号运算符允许我们直接获得其中的内容，也就是解析出的值与剩余字符串的二元组，否则问号运算符会提前返回空值。
  我们在获取了其中的值后，将转化函数应用到值上。
  利用这一点，我们可以将运算符、括号对应的字符再次映射为对应的枚举类型。
  <break time="500ms" />
-->

# 解析器组合子

- 解析`a`，如果成功再解析`b`，并返回`(a, b)`
```moonbit
fn[V1, V2] Lexer::then(self : Lexer[V1], p2 : Lexer[V2]) -> Lexer[(V1, V2)] { ... }
fn[V] Lexer::or(self : Lexer[V], p2 : Lexer[V]) -> Lexer[V] { ... }
```

<!-- ssml
  接下来我们再看几个其他的组合子。
  我们之前看到了其他几个匹配规则，例如先匹配a再匹配b、匹配a或b，匹配零或多个a等。
  这些组合子每一个都很简单，我们一一实现。
  首先是匹配a然后匹配b。
  我们先利用self进行解析，如第3行。
  利用问号运算符获得对应的值和剩余的字符串后，我们利用另一个解析器对剩余的字符串再次解析，如第4行所示。
  我们将两个输出作为二元组一同返回。
  然后是匹配a或b。
  我们对于self解析的结果进行模式匹配，如果为空，那么说明匹配失败，我们用另一个解析器的匹配结果作为整个的结果返回。
  否则，我们直接返回当前的匹配结果。
  <break time="500ms" />
-->

# 解析器组合子

- 重复解析`a`，零或多次，直到失败为止
```moonbit
fn[Value] Lexer::many(self : Lexer[Value]) -> Lexer[@list.T[Value]] {
  Lexer(fn(input) {
    loop (input, @list.empty()) {
      (rest, cumul) =>
        match self.parse(rest) {
          None => Some((cumul.rev(), rest)) // List 是栈，需要反转
          Some((value, rest)) => continue (rest, @list.construct(value, cumul))
        }
    }
  })
}
```

<!-- ssml
  对于匹配零或多次，我们利用一个循环进行。
  如第5到第10行。
  我们对剩余输出尝试进行匹配，如第6行所示。
  如果失败，我们退出循环，否则我们将匹配到的内容添加到列表中，并且更新剩余的字符串所指的内容。
  最后，无论如何匹配都是成功的，因此我们将返回结果放入Some。
  需要注意的是，这里的实现采用了列表进行存储，而列表是一个栈，因此需要翻转一次才能获得正确的顺序。
  <break time="500ms" />
-->

# 词法分析

- 整数分析

```moonbit
let zero = pchar(ch => ch is '0').map(_ => 0)
let digit = pchar(ch => ch is ('0'..='9')).map(ch => ch.to_int() - '0'.to_int())
let nonzero = pchar(ch => ch is ('1'..='9')).map(ch => ch.to_int() - '0'.to_int())
let value : Lexer[Token] =
  zero.or(nonzero.then(digit.many()).map(...)).map(Token::Value(_))
```

<!-- ssml
  最后，我们就可以构造适用于整数的词法分析。
  整数是零或一个非零数字开头加上一连串的任意数字。
  因此我们先构造三个辅助的解析器。
  第一个匹配字符零，并映射为数字零。
  后两个则分别匹配一到九和零到九。
  这里，我们采用UTF编码的范围进行判断，又因为UTF编码中数字是从0到9排列的，因此我们通过计算字符编码与0的编码的差来获得对应的数字。
  最后，我们只需要利用我们的组合子，对照着语法规则进行构造即可。
  如第11、12行所示，我们的构造和规则可以说是一比一复刻。
  不过，非零数字和任意个数字构造出的只是一个数字和数字的列表的二元组，因此我们还要做一次映射。
  我们利用fold_left将它折叠为一个整数。
  靠近列表头的数字在高位，因此如果存在低位数字，只需要每次将高位数字乘以10并加上低位数字即可。
  最后，我们将获得的整数映射为枚举值。
  <break time="500ms" />
-->

# 词法分析

- 对输入流进行分析
  - 在单词之间可能存在空格

  ```moonbit
  let tokens : Lexer[@list.T[Token]] =
    value.or(symbol).then(whitespace.many()).map(p => p.0).many()
  ```
- 例子：`"-10123+-+523 103 ( 5) )"` -> `[Minus, Value(10123), Plus, ...]`

- 我们成功地分割了字符串
  - `-` `10123` `-` `+` `-` `523` `103` `(` `5` `)` `)`
  - 但这不符合数学表达式的语法

<!-- ssml
  到这里我们只差最后一步就完成了词法分析，那就是对整个输入流进行分析。
  考虑到单词之间可能存在空格，因此我们在第二行，定义了数字或符号以后，允许有任意长度的空白字符。
  我们通过一次映射将二元组中的第二个代表空白的舍弃掉，并且对整个解析器进行任意次的重复。
  最后，我们可以把一连串字符串给分割为减号、数字、加号、左右括号等。
  不过，这个输出流并不符合数学表达式的语法。
  要进行这一个判断，我们还需要进行语法分析。
  这个我们留待下一节课。
  <break time="500ms" />
-->

# 语法分析

- 对单词流进行分析，判断是否符合语法
  - 输入：单词流
  - 输出：抽象语法树
  ```abnf
  expression = Value / "(" expression ")"
  expression =/ expression "+" expression / expression "-" expression 
  expression =/ expression "*" expression / expression "/" expression
  ```

  ![](../pics/ast-example.drawio.svg)

<!-- ssml
  大家好，欢迎来到由IDEA研究院基础软件中心为大家带来的现代编程思想公开课。
  今天我们继续语法解析器的案例学习，进入语法分析的部分。
  <break time="500ms" />
-->

# 语法分析

- 语法定义
  ```abnf
  expression = Value / "(" expression ")"
  expression =/ expression "+" expression / expression "-" expression 
  expression =/ expression "*" expression / expression "/" expression
  ```
- 问题：运算符的优先级、结合性
  - 优先级：$\texttt{a} + \texttt{b} \times \texttt{c} \rightarrow \texttt{a} + (\texttt{b} \times \texttt{c})$
  - 结合性：$\texttt{a} + \texttt{b} + \texttt{c} \rightarrow (\texttt{a} + \texttt{b}) + \texttt{c}$
  - 当前语法具有二义性

<!-- ssml
  上节课我们已经将一个字符串转化为了一个单词流，舍弃了无关紧要的空格，并且将字符串分割为了有意义的枚举值的集合。
  现在我们所要做的是对单词流进行判断，它是否符合数学表达式的语法。
  举个最简单的例子，表达式中的括号应该成对出现，并且应该以正确的顺序闭合。
  我们定义了一个简单的语法规则，如中间代码框所示。
  一个数学表达式可以是单个数字，可以是两个数学表达式进行加减乘除，也可以有括号在表达式外。
  我们希望能够正确地将单词流转化为一棵抽象语法树，例如下图所示。
  1 + ( 1 - 5 )所构成的树，最高的节点是加号，代表最后被执行的运算。
  意为1加上右侧语法树所代表的表达式。
  右侧子树中则是减号与1和5，意为1减5。
  因为有括号的存在，使得它被更早执行，因此在表达式树的更下方。
  类似的，对于右侧的表达式(1 - 5) * 5，
  最先计算的是括号中的减号，最后计算的才是乘号。
  <break time="500ms" />
-->

# 语法分析
- 修改后的语法定义
  ```abnf
  atomic     = Value / "(" expression ")"
  combine    = atomic  /    combine "*" atomic  /    combine "/" atomic 
  expression = combine / expression "+" combine / expression "-" combine
  ```

- 注意到除了简单的组合以外，出现了左递归
  - 左递归会导致我们的解析器进入循环
  - 解析器将尝试匹配运算符左侧的规则而不前进
  - 拓展：自底向上解析器可以处理左递归

<!-- ssml
  不过我们的语法定义存在一些小问题。
  因为它并不区分优先级。
  举例来说，a + b * c应该被解读为a加上b与c的乘积，但按照当前的语法定义，a与b的和乘以c也符合这个语法，因此会有歧义。
  而且它也没有体现出结合性。
  四则运算符应当是左结合的，例如a + b + c应当被解读为a与b的和加上c，但是当前的语法同样允许a加上b与c的和。
  因此我们需要稍微调整语法，进行分层。
  <break time="500ms" />
-->

# 语法分析
- 修改后的语法定义
  ```abnf
  atomic     = Value / "(" expression ")"
  combine    = atomic  *( ("*" / "/") atomic)
  expression = combine *( ("+" / "-") combine)
  ```

- 数据结构
  ```moonbit
  enum Expression {
    Number(Int)
    Plus(Expression, Expression); Minus(Expression, Expression)
    Multiply(Expression, Expression); Divide(Expression, Expression)
  }
  ```

<!-- ssml
  修改后的语法规则由一条改为了三条。
  第一条atomic，是整数或被括号包裹的表达式。
  第二条，是atomic或combine乘除atomic。
  第三条则是combine或expression加减combine。
  分成三条的目的是区分运算符的优先级，而单条规则中左递归则是为了体现左结合性。
  不过，我们的解析器处理不了左递归。
  因为当它尝试匹配左递归的规则的时候，它会首先尝试匹配运算符左侧的规则，而那是同一条规则，陷入了递归，导致始终无法前进。
  不过这也只是我们的解析器无法处理这种情况。
  自底向上的解析器可以处理左递归，感兴趣的同学可以参考最后的书目。
  我们修改后的语法定义消除了递归。
  不过需要在进行映射的时候对左递归进行额外处理，这里就不赘述。
  我们定义抽象语法树。
  如之前所说，表达式可以为一个整数，或表达式的四则运算的结果。
  <break time="500ms" />
-->

# 语法解析

- 定义语法解析组合子
  ```moonbit
  type Parser[V] (@list.T[Token]) -> (V, @list.T[Token])?

  fn[V] Parser::parse(self : Parser[V], tokens : @list.T[Token]) -> (V, @list.T[Token])? { self.inner()(tokens) }
  ```
- 大部分组合子与`Lexer[V]`类似
- 递归组合：`atomic = Value / "(" expression ")"`
  - 延迟定义
  - 递归函数

<!-- ssml
  我们定义一个语法解析器。
  和之前的定义类似，只不过输入不再是字符串，而是单词的列表。
  大部分的组合子与之前的类似，可以以同样的方式实现，这里就不赘述。
  问题在于如何定义互递归的语法解析器，因为规则atomic引用了规则expression，而规则experssion基于规则combine基于atomic定义。
  为了解决这个问题，我们在此提供两种解决方案：延迟定义或是递归函数。
  <break time="500ms" />
-->

# 递归定义

- 延迟定义
  - 利用引用定义`Ref[Parser[V]]`：`struct Ref[V] { mut val : V }`
  - 在定义其他解析器后更新引用中内容

  ```moonbit
  fn[Value] Parser::from_ref(ref_ : Ref[Parser[Value]]) -> Parser[Value] {
    Parser(fn(input) { ref_.val.parse(input) })
  }
  ```
  - `ref.val`将在使用时获取，此时已更新完毕

<!-- ssml
  延迟定义的要点在于先定义一个引用，在其中存放一个默认值。
  在依赖它的组合子被定义之后，再修改其中的值，使得在计算的时候获取到的是更新后的值。
  我们这里定义一个简单的ref函数来把引用作为一个普通的解析器，只需要在计算时取出当时的值进行解析即可。
  <break time="500ms" />
-->

# 递归定义

- 延迟定义
  ```moonbit
  fn parser() -> Parser[Expression] {
    let expression_ref : Ref[Parser[Expression]] = { val: Parser(_ => None) }
    let atom = lparen.then(Parser::from_ref(expression_ref)).then(rparen).map(...).or(number)
    let combine = atom.then((multiply.or(divide)).then(atom).many()).map(...)
    expression_ref.val = combine.then((plus.or(minus)).then(combine).many()).map(...)
    expression_ref.val
  }
  ```

<!-- ssml
  之后，我们利用延迟定义来实现表达式的解析。
  我们构造一个expression规则的引用，在里面存放一个默认值。
  这个默认值在任何情况下都会解析失败。
  之后，我们定义第一条规则的解析器，atomic。
  我们利用我们定义的一系列组合子，包括刚才定义的ref，根据语法规则进行构造。
  这里的左右括号的解析器实现比较简单，就在此略过。
  之后同样的，我们定义第二条规则的解析器。
  在定义了第二条规则之后，我们利用它更新最初定义的引用的内容为真正的解析器。
  最后，我们返回这个真正的解析器的内容。
  此时因为内容已经更新完毕，我们可以直接取出其中存放的值。
  <break time="500ms" />
-->

# 递归定义

- 递归函数
  - 解析器本质上是一个函数
  - 定义互递归函数后，将函数装进结构体
  ```moonbit
  fn recursive_parser() -> Parser[Expression] {
    letrec atom = fn(tokens) { ... }
    and combine = fn(tokens) { ... }
    and expression = fn(tokens) { ... }
    Parser(expression) // 返回函数代表的解析器
  }
  ```


<!-- ssml
  递归函数的概念与之类似。
  我们的解析器本质上就是函数，只是用另一个类型进行了包裹加以区分并方便添加方法。
  因此，我们在这里可以定义三个互相递归的函数，如第4、10、11行所示。
  之后，我们在第六行，利用函数构造出对应的解析器即可。
  最后，我们利用同样的方式返回函数所对应的解析器。
  到这里为止，我们的解析器就算完成了。
  我们可以用这个解析器来解析之前分析出的单词流，获得对应的表达式所构成的抽象语法树。
  如果想要计算对应的值，我们可以进行简单的模式匹配即可。
  但除此之外，我们还有别的选择。
  <break time="500ms" />
-->

# 语法树之外：Tagless Final

- 计算表达式，除了生成为抽象语法树再解析，我们还可以有其他的选择
- 我们通过“行为”来进行抽象
  ```moonbit
  trait Expr : Add + Sub + Mul + Div {
    number(Int) -> Self
  }
  ```
  - 接口的不同实现即是对行为的不同语义

<!-- ssml
  我们之前采用的方式是构造抽象语法树，再对语法树进行解析。
  因为利用了枚举类型，因此像打标签一样。
  我们这里介绍另一种模式，<lang xml:lang="en-US">Tagless Final</lang>，在不构造抽象语法树的基础上对表达式进行运算。
  能做到这一点有赖于月兔的接口。
  我们利用行为来进行抽象。
  一个表达式，它可以从一个整数进行构建，在两个表达式之间可以有四则运算。
  基于这一点，我们定义了一个接口。
  那么有接口，就会有实现，而对这个接口的不同实现就是对行为的不同的诠释，或者说语义。
  <break time="500ms" />
-->

# 语法树之外：Tagless Final
- 我们利用行为的抽象定义解析器
  ```moonbit
  fn[E : Expr] recursive_parser() -> Parser[E] {
    let number = ptoken(t => t is Value(_)).map(t => { guard t is Value(i); E::number(i) })
    letrec atomic = fn(tokens) { ... } and combine = fn(tokens) { ... } and expression = fn(tokens) { ... }
    Parser(expression)
  }
  fn[E : Expr] parse_string(str : @string.View) -> (E, @string.View, @list.T[Token])? { ... }
  ```

<!-- ssml
  我们利用行为的抽象来修改我们的解析器。
  首先对于整数，我们所构造的不是枚举类型的整数，而是利用接口的number方法进行构造。
  而在对四则运算的规则的解析中，我们在映射函数中并不是利用枚举类型的构造器，而是利用接口提供的加减乘除运算符。
  最后，我们将词法解析与语法分析结合在一起，获得了一个从字符串到最终结果的解析器。
  注意到，这里都没有指定具体的解析类型，只需要符合表达式的接口即可。
  <break time="500ms" />
-->

# 语法树之外：Tagless Final
- 我们可以提供不同的实现，获得不同的诠释
  ```moonbit
  enum Expression { ... } derive(Show) // 语法树实现
  type BoxedInt Int derive(Show) // 整数实现
  // 实现接口（此处省略其他方法）
  fn BoxedInt::number(i: Int) -> BoxedInt { BoxedInt(i) }
  fn Expression::number(i: Int) -> Expression { Number(i) }
  test {
    // 指定不同返回类型，得到不同诠释
    (parse_string("1 + 1 * (307 + 7) + 5 - 3 - 2") : (Expression, @string.View, @list.T[Token])?) |> ignore
    (parse_string("1 + 1 * (307 + 7) + 5 - 3 - 2") : (BoxedInt, @string.View, @list.T[Token])?) |> ignore
  }
  ```

<!-- ssml
  于是，我们只需要定义不同的实现，并且告诉月兔，我们想要采用这一实现即可。
  前者我们需要对数据结构定义不同的方法来满足接口，例如第4、5行的number及其他的方法等。
  后者则是在使用函数的时候，通过规定返回值的类型，如第8、10行，告诉月兔，类型参数具体是什么，以此获得对应的计算结果。
  对于第8行，我们将会获得的是枚举类型所构造而成的表达式树。
  而第10行，我们将会直接获得计算结果。
  大家也可以尝试，再添建其他的诠释，例如将表达式转化为漂亮的字符串，以此来去除多余的括号空格，也就是对表达式进行格式化。
  <break time="500ms" />
-->

# 总结

- 本节课展示了一个语法解析器
  - 介绍了词法解析的概念
  - 介绍了语法解析的概念
  - 展示了语法解析组合子的定义与实现
  - Tagless Final的概念与实现
- 拓展阅读
  - 调度场算法
  - 斯坦福CS143 第1-8课 或
  - 《编译原理》前五章 或
  - 《现代编译原理》前三章
- 拓展练习
  - 实现兼容各类“流”的语法解析组合子

<!-- ssml
  总结，本章节我们展示了一个语法解析器。
  我们介绍了词法解析的概念、语法解析的概念，并且展示了语法解析组合子的定义与实现，同时拓展了<lang xml:lang="en-US">Tagless Final</lang>的概念和实现等。
  有几点需要补充。
  首先，对于数学表达式而言，在分解为单词后，有一个简单的算法，调度场算法，可直接计算表达式的值，大家可以自行了解。
  另外，语法解析是计算机中的一个重要领域，想要详细了解需要很多的时间，显然不可能在短短的两个视频中说完，因此我们只是做了十分粗浅的介绍。
  感兴趣的同学可以参考斯坦福CS143前8节课，或是编译原理前五章，或是现代编译原理前三章。
  后两本书因为书本封面图案，也会被称为龙书和虎书。
  另外给大家的一个拓展练习。
  大家应该注意到，处理字符串和处理单词流的解析器的结构几乎一模一样，那么有没有办法对字符串和单词流进行一个抽象，实现一个兼容各类“流”的语法解析组合子呢？
  这个就留给大家进行思考了。
  最后一点希望大家能够注意到蕴含在语法解析组合子中的重要的编程思想，那就是构建可组合的模块，由小到大，由简单到复杂构建程序。
  通过这样的模块化思想，我们可以控制复杂度，摒弃无关的信息。
  例如，在最后当我们定义解析器的时候，我们利用组合子基本上是一比一复刻语法，而不用再关心解析器的具体实现了。
  只有这样，我们才能构建更大规模的、可以维护的、更少bug的程序。
  那么以上便是本节课的内容，感谢大家收看。
  <break time="500ms" />
-->
