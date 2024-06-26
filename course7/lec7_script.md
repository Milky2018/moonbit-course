# 现代编程思想：命令式编程

大家好，欢迎来到由IDEA研究院基础软件中心为大家带来的现代编程思想公开课。今天让我们来学习命令式编程。

我们到目前为止，介绍的都可以归类在函数式编程的范畴。

那么什么是函数式编程呢？函数式编程，如同名字一样，类似于函数，对于每一个输入，总是有着特定的输出。对于每个标识符，我们可以直接用定义的值进行替代，这个性质被称为引用透明性。不过，为了开发一些实用的程序，我们通常会需要计算以外的一些副作用。举例来说，我们可能需要进行输入输出，我们可能要修改内存中的数据等。这些副作用就有可能会破坏我们的引用透明性，使得多次执行的结果不一致。

让我们先来看一个简单的例子，重新回顾一下我们之前学习的化简的规则。我们定义如下的数据绑定和函数：一个为2的值，以及一个计算整数平方的`square`函数。之后，我们应用`square`函数对`x`进行运算。我们可以简单将`square`与`x`分别用他们的定义替换，运算的结果事实上是一样的。这也是我们一直以来介绍的运算规则：将标识符用定义的数据进行替换。这样的引用透明性的规则十分简单，十分易于理解。而我们接下来要看到的就不一定了。

我们首先来介绍一个简单的命令：函数`print`。在月兔中，`print`被用来输出一个字符串，例如`print(Hello World!")`就应当输出一个字符串，`Hello World`。月兔中，我们利用`init`代码块来定义初始化指令。这个代码块将会在程序的最初进行运算。到目前为止，可以简单地把它看成是程序的主入口，也就是程序会从这里开始执行。我们将两者组合起来，获得下面的例子。例子中我们使用`println`作为输出，它与`print`的区别是会在输出最后加上一个换行符。下图就是在我们的网页开发环境中运行这段代码的结果。可以看到，它在下方输出了我们所想要显示的字符。周围有一些相关的信息，大家可以选择性无视。我们在这里可以看到，最后的执行时间的报告是在`moonbit`之后换了一行。而如果我们选择`print`函数，则会紧跟在后面，就像接下来所示。

在这里，我们展示了副作用对于程序理解的影响。我们在这里依然定义了我们的平方函数。与之前不同的是，我们的`x`的定义变为了一个代码块，并且这个代码块中，在值`2`之前，还有一个额外的命令，这个命令会输出"Hello World"。这个时候，我们不能简单地对标识符`x`进行替换操作，而是要先对`x`的定义进行求值，再将求得的值替换`x`出现过的地方。在这里，执行顺序从上到下。我们首先计算`x`的值。计算`x`的值的时候也是从上到下，先执行输出命令，因此我们在下方结果中可以看到一次输出。之后我们获得2作为整个代码块的值绑定到`x`上。之后，再出现`x`的时候，便会用2替代。例如之后的`z`的值，就会是2 * 2的结果，也就是4。

而如果我们按照之前的那样，直接将所有`x`和`square`出现的地方替换为定义的话。便会如代码所示。我们再来捋一下这一个部分。首先，我们计算乘号左右两侧代码块的值，最后将两者相加。求乘号左侧代码块的时候，我们从上到下依次执行，进行了一次输出，获得了值2。之后我们对乘号右侧代码块进行求值，进行了一次输出，获得了值2。因此，我们在下方的运行结果中可以看到，此时的运行结果是两次输出，而非一次输出。因此我们可以看到，命令等带来的副作用会破坏引用透明性，让代码的理解难度加大。

大家可能会好奇的一个问题是，命令有没有值，以及输出函数的值是什么。通常情况下，我们在执行带有副作用的命令后，可能不关心它的具体运行状况，那么这种时候我们一般会用单值类型`Unit`来表示。它也可以看成是长度为零的多元组。我们可以声明函数的返回值类型为`Unit`，也可以省略这一部分。我们可以看到，`let`语句本身也是有值的，这个值就是单值类型，它符合整个函数的类型声明，因此可以正常编译。

接下来我们要介绍的是变量。在月兔中，我们可以通过`var`在代码块中定义变量。我们通过`var`定义一个标识符，给它赋予最初的值。之后，我们可以通过`x = 10`的形式来更换其中的值。赋值操作是一个命令，因此它的值也是单值类型`Unit`。我们之前介绍过结构体。在月兔中，结构体的字段默认是不可变的。不过，我们也允许可变的字段。这样的字段需要通过`mut`来标识，例如下面的例子中，`Ref`的`val`字段是可变的。之后，我们可以通过`ref.val`来访问这个值，也可以通过`ref.val = 10`来对这个值进行修改。

我们可以把标识符看作是一个放着值的盒子。当我们在修改可变变量的时候，我们是在替换这个盒子中存放的值。而这个盒子装着结构体的时候则可以看作是一个指向结构体的引用。在中间的图，我们用`let`将一个标识符绑定了一个结构体。`ref`指向的是这个结构体。当我们利用`ref`修改结构体中的值的时候，我们修改的是它所引用的这个结构体中装着的值，而我们所指向的始终是同一个结构体，因此`ref`并没有发生变化。而当我们在右图中定义了一个可变的`ref`并对它进行修改的时候，我们是创建了一个新的盒子，并且将`ref`重新修改为指向新的盒子的引用。

那既然是引用，我们当然也可以有多个标识符指向同一个结构体。这种情况我们可以把这些标识符看作是别名。例如我们首先定义了一个`alter`函数，它接受两个结构体，并且挨个修改这两个结构体中存放的值。之后我们在主程序中定义一个`x`，存放了1。我们将`x`作为参数传给`alter`。注意，这里的参数`a`和`b`，我们都传了`x`，因此实际上，`x`会发生两次变化，最终变为20。

我们在这里用这张图来看一下流程。当我们计算`alter(x, x)`的时候，原本函数中定义的`a`和`b`都被替换为了`x`，因为这是我们传进的参数。而我们刚才解释，装着结构体的时候可以看作是一个指向结构体的引用，因此它们实质上是获得了相同的引用，都在指向右下角的结构体。之后我们逐个执行指令。首先，我们修改原来的`a`，于是，结构体的值按照我们的命令发生了变化。之后我们修改`b`。此时，结构体的值再次发生变化。由于它们实质上指向的是同样的结构体，也就是最初`x`指向的结构体，因此在程序结束之后，`x`的值便是20。

此处应有分割线

我们可以利用变量定义循环。这是另一种在月兔中重复执行某个行为的方式。我们在循环的时候总是要知道什么时候停止循环，否则将会无穷无尽进行，陷入死循环。循环的定义包含定义一个变量。我们将会根据这个变量的值判断是否继续进行循环。我们还要定义，每次循环之后，如何修改这个变量。因为，如果不修改，那么要么一次也不执行，要么就陷入死循环。例如在下方，我们给了一个循环输出n次的例子。我们首先定义了一个计数器，赋予它一个初始值0。之后，每次循环时，我们根据计数器记录的已经循环的次数判断循环是否需要中止，在输出以后，我们修改循环的计数器。传统上，写循环的时候计数器初始值从0开始，判断条件使用小于n。

循环执行的具体流程是，先判断是否满足循环的条件，之后执行命令，并最终对变量进行迭代。之后，我们重复上述过程，判断是否满足循环条件，执行命令，迭代变量。例如这里，我们从0开始，进行判断。结果为真，我们继续执行，进行第一次输出。之后，我们迭代计数器。此时，i为1。我们进行判断，之后再进行循环，并进行第二次输出。之后我们再次迭代计数器。最后，i等于2时，我们进行条件判断，发现条件不成立，于是结束循环，进入后续代码的执行。

月兔提供了调试器，目前还在完善中。我们利用调试器可以更好地观察到我们的运行行为。我们目前需要在一个完整的本地项目中使用，之后会进行优化。我们可以利用调试器逐步执行来观察效果。例如此处我们在循环前添加断点。我们逐步执行语句，可以看到我们首先进行了判定。之后则进行了修改，最后进行了迭代。我们可以在右侧看到我们的数据的变化。

循环事实上和递归是等价的。对于一个需暖，我们可以将它写成递归的形式。我们定义一个函数`loop`，它的参数是循环的计数器。我们在函数中定义一个条件判断，如果无需继续循环，那么我们直接返回单值类型。如果需要继续循环，那么我们执行命令，并且将迭代后的参数作为新的参数传进递归调用的`loop`函数中去。而初始值则是在使用`loop`函数的时候传入。例如，这里的两段代码的效果是完全相同的。

我们有的时候并不希望循环一直进行下去。例如，如果我们在查找某个值，当我们找到之后，我们会提前中止循环。那么这个时候，我们就有其他的选项来改变我们的循环流。`break`可以被用来提前中止我们的循环。例如在下面的例子中，我们可以跳过从3开始的情况。`continue`则可以被用来跳过当前循环中剩下的内容，在复杂的结构中会比较好用。例如在下面的例子中，我们直接跳过了当前计数器为3的情况。

月兔会给我们提供很多的检查。例如，如果我们声明了一个标识符应当为变量，那么月兔会检查它是否被修改过。一种场景就是在写循环的时候可能会忘记对计数器进行迭代。这种时候，我们就可以发现错误，尽早修正。月兔还会检查我们的返回值是否和类型声明相同，即便我们的返回类型声明的是单值类型，也不会自动舍弃运算结果，而是需要手动添加声明来做到。这也是为了避免我们可能会漏写返回类型的声明。

可变数据虽然在理解计算模型上会比函数式的替换化简更加困难，并且可能会引入很多潜在的问题，但是可变数据应用广泛。举例来说，我们直接操作程序外环境，例如硬件的时候，就很可能用到可变数据；可变数据在一些时候性能会更好，例如在随机访问数据的时候，数组这一数据结构会比我们一直使用的列表性能更好；可变数据允许我们构建某些复杂的数据结构，例如图；而可变数据的原地修改也可以让我们更好地利用内存空间，因为原地修改不会引入额外的空间消耗。

同时，可变数据也并不总是与引用透明性冲突。例如在这里，我们定义了一个简单的利用了可变数据的斐波那契数列。我们利用动态规划，从0开始向上迭代计算我们所寻找的项数。在这个过程中，和递归版本不同的是，我们通过循环和修改变量来进行数据的迭代。但不论如何，对于各处使用了`fib_mut`进行计算的地方，我们可以直接把`fib_mut`给替换为最终的计算结果，例如`fib_mut(1)`可以替换为1，而运行的结果都是相同的，因为我们并没有产生任何的副作用。

总结，本章节初步接触了命令式编程，了解了如何使用一些命令，如何使用变量，以及如何使用循环等。
