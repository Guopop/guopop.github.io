---
outline: deep
---

# 面向对象

### 四大特性：

封装、抽象、继承、多态

> 面向对象分析就是要搞清楚做什么，面向对象设计就是要搞清楚怎么做，面向对象编程就是将分析和设计的的结果翻译成代码的过程

### 封装（encapsulation）

通过有限的方法暴露必要的操作

### 抽象（Abstraction）

隐藏方法的具体实现

定义类的方法时也要抽象，在修改其实现后，不需要修改定义

### 继承（Inheritance）

代码复用

### 多态（Polymorphism）

提高代码的可扩展性和复用性

### 优势

对于大规模复杂程序的开发，程序的处理流程并非单一的一条主线，而是错综复杂的网状结构

易扩展、易复用、易维护

### 设计

* Constants 类拆解为功能更加单一的多个类

* 设计 Utils 类的时候，最好也能细化一下，针对不同的功能，设计不同的 Utils 类

### 抽象类与接口

* 抽象类更多的是为了代码复用，而接口就更侧重于解耦。

* 如果我们要表示一种 is-a 的关系，并且是为了解决代码复用的问题，我们就用抽象类；如果我们要表示一种 has-a
  关系，并且是为了解决抽象而非代码复用的问题，那我们就可以使用接口

### 基于接口而非实现编程

* 越抽象、越顶层、越脱离具体某一实现的设计，越能提高代码的灵活性，越能应对未来的需求变化。好的代码设计，不仅能应对当下的需求，而且在将来需求发生变化的时候，仍然能够在不破坏原有代码设计的情况下灵活应对

* 函数命名不能暴露任何实现细节

* 封闭具体的实现细节

* 为实现类定义抽象接口

### 组合优于继承

* 继承主要有三个作用：表示 is-a 关系，支持多态特性，代码复用。而这三个作用都可以通过组合、接口、委托三个技术手段来达成

### DDD开发

业务逻辑放在Domain中

Service类职责

* 负责与Repository交流

* 负责跨领域模型的业务聚合

* 负责一些非功能性及三方系统交互工作

### 需求分析

* 划分职责进而识别有哪些类

* 定义类及其属性和方法

* 定义类与类之间的交互关系

* 将类组装起来并提供执行入口

### UML

# 设计原则

### 单一职责原则

Single Responsibility Principle

* A class or module should have a single responsibility

* 把模块看作比类更加粗粒度的代码块，模块中包含多个类，多个类组成一个模块。

* 我们可以先写一个粗粒度的类，满足业务需求。随着业务的发展，如果粗粒度的类越来越庞大，代码越来越多，这个时候，我们就可以将这个粗粒度的类，拆分成几个更细粒度的类。这就是所谓的持续重构

* 拆分判断

* 类中的代码行数，函数或属性过多

* 类依赖的其他类过多

* 私有方法过多， 我们就要考虑能否将私有方法独立到新的类中，设置为 public 方法，供更多的类使用，从而提高代码的复用性

* 比较难给类起一个合适名字，很难用一个业务名词概括，或者只能用一些笼统的 Manager、Context 之类的词语来命名，这就说明类的职责定义得可能不够清晰

* 类中大量的方法都是集中操作类中的某几个属性

* 一个类的代码行数最好不能超过 200 行，函数个数及属性个数都最好不要超过 10 个

* 单一职责原则是为了实现代码高内聚、低耦合，提高代码的复用性、可读性、可维护性

* 不同的应用场景、不同阶段的需求背景、不同的业务层面，对同一个类的职责是否单一，可能会有不同的判定结果

### 开闭原则

Open Closed Principle

* software entities (modules, classes, functions, etc.) should be open for extension , but closed for modification

* 闭原则讲的就是代码的扩展性问题

* 在识别出代码可变部分和不可变部分之后，我们要将可变部分封装起来，隔离变化，提供抽象化的不可变接口，给上层系统使用

* 以最小的修改代码的代价来完成新功能的开发

### 里式替换原则

Liskov Substitution Principle

* Functions that use pointers of references to base classes must be able to use objects of derived classes without
  knowing it

* 子类对象（object of subtype/derived class）能够替换程序（program）中父类对象（object of base/parent
  class）出现的任何地方，并且保证原来程序的逻辑行为（behavior）不变及正确性不被破坏。

* design by contract，按照协议来设计

### 接口隔离原则

Interface Segregation Principle

* 在设计微服务或者类库接口的时候，如果部分接口只被部分调用者使用，那我们就需要将这部分接口隔离出来，单独给对应的调用者使用，而不是强迫其他调用者也依赖这部分不会被用到的接口。

* 函数的设计要功能单一

* 接口隔离原则提供了一种判断接口的职责是否单一的标准：通过调用者如何使用接口来间接地判定

### 依赖反转原则

Dependency Inversion Principle

* High-level modules shouldn’t depend on low-level modules. Both modules should depend on abstractions. In addition,
  abstractions shouldn’t depend on details. Details depend on abstractions.

* 控制反转(IOC)

* 框架提供了一个可扩展的代码骨架，用来组装对象、管理整个执行流程。程序员利用框架进行开发的时候，只需要往预留的扩展点上，添加跟自己业务相关的代码，就可以利用框架来驱动整个程序流程的执行。

* 依赖注入(DI)

* 不通过 new() 的方式在类内部创建依赖类对象，而是将依赖的类对象在外部创建好之后，通过构造函数、函数参数等方式传递（或注入）给类使用。

### KISS原则

Keep It Simple and Stupid

* KISS 原则就是保持代码可读和可维护的重要手段。代码足够简单，也就意味着很容易读懂，bug 比较难隐藏。即便出现 bug，修复起来也比较简单

* 本身就复杂的问题，用复杂的方法解决

* 不要重复造轮子，要善于使用已经有的工具类库

* 不要过度优化

### DRY原则

Don't Repeat Yourself

* 实现逻辑重复、功能语义重复和代码执行重复

* 减少代码耦合

* 满足单一职责原则

* 模块化

* 业务与非业务逻辑分离

* 通用代码下沉

* 继承、多态、抽象、封装

* 应用模板等设计模式

* 第一次编写代码的时候，我们不考虑复用性；第二次遇到复用场景的时候，再进行重构使其复用

* 实现逻辑重复，但功能语义不重复的代码，并不违反 DRY 原则。实现逻辑不重复，但功能语义重复的代码，也算是违反 DRY 原则

* 代码执行重复也算是违反 DRY 原则

### 迪米特法则

Law of Demeter

* "高内聚"用来指导类本身的没计

* "松耦合"用来指导类与类之间依赖关系的设计

* 高内聚，就是指相近的功能应该放到同一个类中

* 松耦合，类与类之间的依赖关系简单清晰

* 该有直接依赖关系的类之间，不要有依赖；有依赖关系的类之间，尽量只依赖必要的接口（也就是定义中的“有限知识”）

* 基于最小接口而非最大实现编程

### 需求分析

* 如果一个功能的修改或添加，经常要跨团队、跨项目、跨系统才能完成，那说明模块划分的不够合理，职责不够清晰，耦合过于严重。

* 为了避免业务知识的耦合，让下层系统更加通用，一般来讲，我们不希望下层系统（也就是被调用的系统）包含太多上层系统（也就是调用系统）的业务信息，但是，可以接受上层系统包含下层系统的业务信息。

* 比较常见的系统之间的交互方式有两种，一种是同步接口调用，另一种是利用消息中间件异步调用。第一种方式简单直接，第二种方式的解耦效果更好。

* 上下层系统之间的调用倾向于通过同步接口，同层之间的调用倾向于异步消息调用。

### MVC三层开发优点

* 分层可以代码复用

* 分层可以隔离变化

* Repository 层只关注数据的读写。Service 层只关注业务逻辑，不关注数据的来源。Controller
  层只关注与外界打交道，数据校验、封装、格式转换，并不关心业务逻辑。三层之间的关注点不同，分层之后，职责分明，更加符合单一职责原则，代码的内聚性更好

* 分层可以提高代码可测试性

* 分层可以应对系统的复杂性

* 为了尽量减少每层之间的耦合，把职责边界划分明确，每层都会维护自己的数据对象，层与层之间通过接口交互。

# 设计模式创建型

### 单例模式

* 构造函数需要是private访问权限，避免外部new创建实例

* 考虑对象创建时的线程安全问题

* 考虑是否支持延迟加载

* 考虑getInstance()性能是否高

#### 饿汉式

```java
public class IdGenerator {
    private static final IdGenerator instance = new IdGenerator();
    private AtomicLong id = new AtomicLong();

    private IdGenerator() {
    }

    public static IdGenerator getInstance() {
        return instance;
    }

    public long getId() {
        return id.incrementAndGet();
    }
}
```

#### 懒汉式

#### 双重检测

```java
public class IdGenerator {
    private AtomicLong id = new AtomicLong();
    private static IdGenerator instance;
    private IdGenerator() {}
    public static synchronized IdGenerator getInstance() {
        if (instance == null) {
            instance = new IdGenerator();
        }
        return instance;
    }
    public long getId() {
       return id.incrementAndGet();
    }
}
```

```java
public class IdGenerator {
    private AtomicLong id = new AtomicLong();
    private static IdGenerator instance;
    private IdGenerator() {}
    public static IdGenerator getInstance() {
        if (instance == null) {
            synchronized (IdGenerator.class) {
                if (instance == null) {
                    instance = new IdGenerator();
                }
            }
        }
        return instance;
    }
    public long getId() {
        return id.incrementAndGet();
    }
}
```

#### 静态内部类

```java
public class IdGenerator {
    private AtomicLong id = new AtomicLong();
    private IdGenerator() {}

    private static class SingletonHolder {
        private static final IdGenerator instance = new IdGenerator();
    }

    public static IdGenerator getInstance() {
        return SingletonHolder.instance;
    }

    public long getId() {
        return id.incrementAndGet();
    }
}
```

#### 枚举

```java
public enum IdGenerator {
    INSTANCE;
    private AtomicLong id = new AtomicLong();

    public long getId() {
        return id.incrementAndGet();
    }
}
```

> 单例类中对象的唯一性的作用范围是进程内的，在进程间是唯一的

#### 线程唯一单例

```java
public class IdGenerator {
    private AtomicLong id = new AtomicLong();
    private static final ConcurrentHashMap<Long, IdGenerator> instances = new ConcurrentHashMap<>();

    private IdGenerator() {}

    public static IdGenerator getInstance() {
        Long currentThreadId = Thread.currentThread().getId();
        instances.putIfAbsent(currentThreadId, new IdGenerator());
        return instances.get(currentThreadId);
    }

    public long getId() {
        return id.incrementAndGet();
    }
}
```

### 工厂模式

当创建逻辑比较复杂，是一个“大工程”的时候，我们就考虑使用工厂模式，封装对象的创建过程，将对象的创建和使用相分离

工厂模式是用来创建不同但是相关类型的对象（继承同一父类或者接口的一组子类），由给定的参数来决定创建哪种类型的对象

* 封装变化：创建逻辑有可能变化，封装成工厂类之后，创建逻辑的变更对调用者透明。

* 代码复用：创建代码抽离到独立的工厂类之后可以复用。

* 隔离复杂性：封装复杂的创建逻辑，调用者无需了解如何创建对象。

* 控制复杂度：将创建代码抽离出来，让原本的函数或类职责更单一，代码更简洁。

#### 简单工厂

违反开闭原则，对于不经常改动的实现，没有问题

```java
public interface RuleConfigParser {}

public class JsonRuleConfigParser implements RuleConfigParser {}

public class XmlRuleConfigParser implements RuleConfigParser {}

public class RuleConfigParserFactory {
    public static RuleConfigParser createParser(String configFormat) {
        RuleConfigParser parser = null;
        if ("json".equalsIgnoreCase(configFormat)) {
            parser = new JsonRuleConfigParser();
        } else if ("xml".equalsIgnoreCase(configFormat)) {
            parser = new XmlRuleConfigParser();
        }
        return parser;
    }
}
```

#### 工厂方法

符合开闭原则，可读性不好

```java
public interface RuleConfigParserFactory {
    RuleConfigParser createParser();
}

public class JsonRuleConfigParserFactory implements RuleConfigParserFactory {
    @Override
    public RuleConfigParser createParser() {
        return new JsonRuleConfigParser();
    }
}

public class XmlRuleConfigParserFactory implements RuleConfigParserFactory {
    @Override
    public RuleConfigParser createParser() {
        return new XmlRuleConfigParser();
    }
}

public class RuleConfigParserFactoryMap {
    private static final Map<String, RuleConfigParserFactory> cachedFactories = new HashMap<>();

    static {
        cachedFactories.put("json", new JsonRuleConfigParserFactory());
        cachedFactories.put("xml", new XmlRuleConfigParserFactory());
    }

    public static RuleConfigParserFactory getParserFactory(String type) {
        if (type == null || type.isEmpty()) {
            return null;
        }
        RuleConfigParserFactory ruleConfigParserFactory = cachedFactories.get(type.toLowerCase(Locale.ROOT));
        return ruleConfigParserFactory;
    }
}

public class RuleConfigSource {
    public void load() {
        RuleConfigParserFactory factory = RuleConfigParserFactoryMap.getParserFactory("json");
        RuleConfigParser parser = factory.createParser();
    }
}
```

> 基于这个设计思想，当对象的创建逻辑比较复杂，不只是简单的 new
> 一下就可以，而是要组合其他类对象，做各种初始化操作的时候，我们推荐使用工厂方法模式，将复杂的创建逻辑拆分到多个工厂类中，让每个工厂类都不至于过于复杂

#### 抽象工厂

一个工厂负责创建多个不同类型的对象

```java
public interface RuleConfigParser {}

public interface SystemConfigParser {}

public class JsonRuleConfigParser implements RuleConfigParser {}

public class JsonSystemConfigParser implements SystemConfigParser {}

public interface ConfigParserFactory {
    RuleConfigParser createRuleParser();
    SystemConfigParser createSystemParser();
}

public class JsonConfigParserFactory implements ConfigParserFactory {
    @Override
    public RuleConfigParser createRuleParser() {
        return new JsonRuleConfigParser();
    }

    @Override
    public SystemConfigParser createSystemParser() {
        return new JsonSystemConfigParser();
    }
}
```

### 建造者模式

建造者模式是让建造者类来负责对象的创建工作

建造者模式是用来创建一种类型的复杂对象，通过设置不同的可选参数，“定制化”地创建不同的对象

```java
@Getter
public class ResourcePoolConfig {
    private String name;
    private int maxTotal;
    private int maxIdle;
    private int minIdle;

    private ResourcePoolConfig(Builder builder) {
        this.name = builder.name;
        this.maxTotal = builder.maxTotal;
        this.maxIdle = builder.maxIdle;
        this.minIdle = builder.minIdle;
    }

    public static class Builder {
        private static final int DEFAULT_MAX_TOTAL = 8;
        private static final int DEFAULT_MAX_IDLE = 8;
        private static final int DEFAULT_MIN_IDLE = 8;

        private String name;
        private int maxTotal = DEFAULT_MAX_TOTAL;
        private int maxIdle = DEFAULT_MAX_IDLE;
        private int minIdle = DEFAULT_MIN_IDLE;

        public ResourcePoolConfig build() {
            if (StrUtil.isBlank(name)) {
                throw new IllegalArgumentException("...");
            }
            if (maxIdle > maxTotal) {
                throw new IllegalArgumentException("...");
            }
            if (minIdle > maxTotal || minIdle > maxIdle) {
                throw new IllegalArgumentException("...");
            }
            return new ResourcePoolConfig(this);
        }

        public Builder name(String name) {
            if (StrUtil.isBlank(name)) {
                throw new IllegalArgumentException("name should not be empty.");
            }
            this.name = name;
            return this;
        }

        public Builder maxTotal(int maxTotal) {
            if (maxTotal <= 0) {
                throw new IllegalArgumentException("maxTotal should be positive.");
            }
            this.maxTotal = maxTotal;
            return this;
        }

        public Builder maxIdle(int maxIdle) {
            if (maxIdle < 0) {
                throw new IllegalArgumentException("maxIdle should be positive.");
            }
            this.maxIdle = maxIdle;
            return this;
        }

        public Builder minIdle(int minIdle) {
            if (minIdle < 0) {
                throw new IllegalArgumentException("minIdle should be positive.");
            }
            this.minIdle = minIdle;
            return this;
        }

    }
}

public class Test {
    public static void main(String[] args) {
        ResourcePoolConfig config = new ResourcePoolConfig.Builder()
                .name("db")
                .maxTotal(16)
                .maxIdle(10)
                .minIdle(12)
                .build();
    }
}
```

### 原型模式

如果对象的创建成本比较大，而同一个类的不同对象之间差别不大（大部分字段都相同），在这种情况下，我们可以利用对已有对象（原型）进行复制（或者叫拷贝）的方式来创建新对象，以达到节省创建时间的目的。这种基于原型来创建对象的方式就叫作原型设计模式

原型模式有两种实现方法，深拷贝和浅拷贝。浅拷贝只会复制对象中基本数据类型数据和引用对象的内存地址，不会递归地复制引用对象，以及引用对象的引用对象……而深拷贝得到的是一份完完全全独立的对象。所以，深拷贝比起浅拷贝来说，更加耗时，更加耗内存空间。

深拷贝

```java

public class Demo {
  private HashMap<String, SearchWord> currentKeywords=new HashMap<>();
  private long lastUpdateTime = -1;

  public void refresh() {
    // Deep copy
    HashMap<String, SearchWord> newKeywords = new HashMap<>();
    for (HashMap.Entry<String, SearchWord> e : currentKeywords.entrySet()) {
      SearchWord searchWord = e.getValue();
      SearchWord newSearchWord = new SearchWord(
              searchWord.getKeyword(), searchWord.getCount(), searchWord.getLastUpdateTime());
      newKeywords.put(e.getKey(), newSearchWord);
    }

    // 从数据库中取出更新时间>lastUpdateTime的数据，放入到newKeywords中
    List<SearchWord> toBeUpdatedSearchWords = getSearchWords(lastUpdateTime);
    long maxNewUpdatedTime = lastUpdateTime;
    for (SearchWord searchWord : toBeUpdatedSearchWords) {
      if (searchWord.getLastUpdateTime() > maxNewUpdatedTime) {
        maxNewUpdatedTime = searchWord.getLastUpdateTime();
      }
      if (newKeywords.containsKey(searchWord.getKeyword())) {
        SearchWord oldSearchWord = newKeywords.get(searchWord.getKeyword());
        oldSearchWord.setCount(searchWord.getCount());
        oldSearchWord.setLastUpdateTime(searchWord.getLastUpdateTime());
      } else {
        newKeywords.put(searchWord.getKeyword(), searchWord);
      }
    }

    lastUpdateTime = maxNewUpdatedTime;
    currentKeywords = newKeywords;
  }

  private List<SearchWord> getSearchWords(long lastUpdateTime) {
    // TODO: 从数据库中取出更新时间>lastUpdateTime的数据
    return null;
  }

}
```

浅拷贝

```java

public class Demo {
  private HashMap<String, SearchWord> currentKeywords=new HashMap<>();
  private long lastUpdateTime = -1;

  public void refresh() {
    // Shallow copy
    HashMap<String, SearchWord> newKeywords = (HashMap<String, SearchWord>) currentKeywords.clone();

    // 从数据库中取出更新时间>lastUpdateTime的数据，放入到newKeywords中
    List<SearchWord> toBeUpdatedSearchWords = getSearchWords(lastUpdateTime);
    long maxNewUpdatedTime = lastUpdateTime;
    for (SearchWord searchWord : toBeUpdatedSearchWords) {
      if (searchWord.getLastUpdateTime() > maxNewUpdatedTime) {
        maxNewUpdatedTime = searchWord.getLastUpdateTime();
      }
      if (newKeywords.containsKey(searchWord.getKeyword())) {
        newKeywords.remove(searchWord.getKeyword());
      }
      newKeywords.put(searchWord.getKeyword(), searchWord);
    }

    lastUpdateTime = maxNewUpdatedTime;
    currentKeywords = newKeywords;
  }

  private List<SearchWord> getSearchWords(long lastUpdateTime) {
    // TODO: 从数据库中取出更新时间>lastUpdateTime的数据
    return null;
  }
}
```

# 设计模式结构型

### 代理模式

它在不改变原始类（或叫被代理类）代码的情况下，通过引入代理类来给原始类附加功能

#### 动态代理

```java
public class MetricsCollectorProxy {
    private MetricsCollector metricsCollector;

    public MetricsCollectorProxy() {
        this.metricsCollector = new MetricsCollector();
    }

    public Object createProxy(Object proxiedObject) {
        Class<?>[] interfaces = proxiedObject.getClass().getInterfaces();
        DynamicProxyHandler handler = new DynamicProxyHandler(proxiedObject);
        return Proxy.newProxyInstance(proxiedObject.getClass().getClassLoader(), interfaces, handler);
    }

    private class DynamicProxyHandler implements InvocationHandler {
        private Object proxiedObject;

        public DynamicProxyHandler(Object proxiedObject) {
            this.proxiedObject = proxiedObject;
        }

        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            long startTimestamp = System.currentTimeMillis();
            Object result = method.invoke(proxiedObject, args);
            long endTimestamp = System.currentTimeMillis();
            long responseTime = endTimestamp - startTimestamp;
            String apiName = proxiedObject.getClass().getName() + ":" + method.getName();
            RequestInfo requestInfo = new RequestInfo(apiName, responseTime, startTimestamp);
            metricsCollector.recordRequest(requestInfo);
            return result;
        }
    }
}

public class Test {
    public static void main(String[] args) {
        MetricsCollectorProxy proxy = new MetricsCollectorProxy();
        IUserController userController = (IUserController) proxy.createProxy(new UserController());
    }
}
```

#### 代理模式的应用场景

#### 业务系统的非功能需求开发

监控，统计，鉴权，限流，事务，幂等，日志

#### 代理模式在RPC、缓存中的应用

如果是基于 Spring 框架来开发的话，那就可以在 AOP
切面中完成接口缓存的功能。在应用启动的时候，我们从配置文件中加载需要支持缓存的接口，以及相应的缓存策略（比如过期时间）等。当请求到来的时候，我们在
AOP 切面中拦截请求，如果请求中带有支持缓存的字段（比如 http\://…?..\&cached=true），我们便从缓存（内存缓存或者 Redis
缓存等）中获取数据直接返回。

### 桥接模式

Decouple an abstraction from its implementation so that the two can vary independently

```java

public interface MsgSender {
  void send(String message);
}

public class TelephoneMsgSender implements MsgSender {
  private List<String> telephones;

  public TelephoneMsgSender(List<String> telephones) {
    this.telephones = telephones;
  }

  @Override
  public void send(String message) {
    //...
  }

}

public class EmailMsgSender implements MsgSender {
  // 与TelephoneMsgSender代码结构类似，所以省略...
}

public class WechatMsgSender implements MsgSender {
  // 与TelephoneMsgSender代码结构类似，所以省略...
}

public abstract class Notification {
  protected MsgSender msgSender;

  public Notification(MsgSender msgSender) {
    this.msgSender = msgSender;
  }

  public abstract void notify(String message);
}

public class SevereNotification extends Notification {
  public SevereNotification(MsgSender msgSender) {
    super(msgSender);
  }

  @Override
  public void notify(String message) {
    msgSender.send(message);
  }
}

public class UrgencyNotification extends Notification {
  // 与SevereNotification代码结构类似，所以省略...
}
public class NormalNotification extends Notification {
  // 与SevereNotification代码结构类似，所以省略...
}
public class TrivialNotification extends Notification {
  // 与SevereNotification代码结构类似，所以省略...
}
```

### 装饰器模式

装饰器类和原始类继承同样的父类，这样我们可以对原始类“嵌套”多个装饰器类

装饰器类是对功能的增强，这也是装饰器模式应用场景的一个重要特点

防止继承过多，组合代替继承

```java
InputStream in = new FileInputStream("/user/wangzheng/test.txt");
InputStream bin = new BufferedInputStream(in);
DataInputStream din = new DataInputStream(bin);
int data = din.readInt();
```

```java
// 装饰器模式的代码结构(下面的接口也可以替换成抽象类)
public interface IA { 
    void f();
}
public class A implements IA { 
    public void f() { 
        //... 
    }
}
public class ADecorator implements IA { 
    private IA a;
    public ADecorator(IA a) {
        this.a = a; 
    } 
    public void f() { 
        // 功能增强代码 
        a.f(); 
        // 功能增强代码 
    }
}
```

### 适配器模式

类适配器使用继承关系来实现，对象适配器使用组合关系来实现

应用场景是“接口不兼容”

封装有缺陷的接口设计

```java

public class CD { //这个类来自外部sdk，我们无权修改它的代码
  //...
  public static void staticFunction1() { //... }
  
  public void uglyNamingFunction2() { //... }

  public void tooManyParamsFunction3(int paramA, int paramB, ...) { //... }
  
   public void lowPerformanceFunction4() { //... }
}

// 使用适配器模式进行重构
public class ITarget {
  void function1();
  void function2();
  void fucntion3(ParamsWrapperDefinition paramsWrapper);
  void function4();
  //...
}
// 注意：适配器类的命名不一定非得末尾带Adaptor
public class CDAdaptor extends CD implements ITarget {
  //...
  public void function1() {
     super.staticFunction1();
  }
  
  public void function2() {
    super.uglyNamingFucntion2();
  }
  
  public void function3(ParamsWrapperDefinition paramsWrapper) {
     super.tooManyParamsFunction3(paramsWrapper.getParamA(), ...);
  }
  
  public void function4() {
    //...reimplement it...
  }
}
```

统一多个类的接口设计

```java

public class ASensitiveWordsFilter { // A敏感词过滤系统提供的接口
  //text是原始文本，函数输出用***替换敏感词之后的文本
  public String filterSexyWords(String text) {
    // ...
  }
  
  public String filterPoliticalWords(String text) {
    // ...
  } 
}

public class BSensitiveWordsFilter  { // B敏感词过滤系统提供的接口
  public String filter(String text) {
    //...
  }
}

public class CSensitiveWordsFilter { // C敏感词过滤系统提供的接口
  public String filter(String text, String mask) {
    //...
  }
}

// 未使用适配器模式之前的代码：代码的可测试性、扩展性不好
public class RiskManagement {
  private ASensitiveWordsFilter aFilter = new ASensitiveWordsFilter();
  private BSensitiveWordsFilter bFilter = new BSensitiveWordsFilter();
  private CSensitiveWordsFilter cFilter = new CSensitiveWordsFilter();
  
  public String filterSensitiveWords(String text) {
    String maskedText = aFilter.filterSexyWords(text);
    maskedText = aFilter.filterPoliticalWords(maskedText);
    maskedText = bFilter.filter(maskedText);
    maskedText = cFilter.filter(maskedText, "***");
    return maskedText;
  }
}

// 使用适配器模式进行改造
public interface ISensitiveWordsFilter { // 统一接口定义
  String filter(String text);
}

public class ASensitiveWordsFilterAdaptor implements ISensitiveWordsFilter {
  private ASensitiveWordsFilter aFilter;
  public String filter(String text) {
    String maskedText = aFilter.filterSexyWords(text);
    maskedText = aFilter.filterPoliticalWords(maskedText);
    return maskedText;
  }
}
//...省略BSensitiveWordsFilterAdaptor、CSensitiveWordsFilterAdaptor...

// 扩展性更好，更加符合开闭原则，如果添加一个新的敏感词过滤系统，
// 这个类完全不需要改动；而且基于接口而非实现编程，代码的可测试性更好。
public class RiskManagement { 
  private List<ISensitiveWordsFilter> filters = new ArrayList<>();
 
  public void addSensitiveWordsFilter(ISensitiveWordsFilter filter) {
    filters.add(filter);
  }
  
  public String filterSensitiveWords(String text) {
    String maskedText = text;
    for (ISensitiveWordsFilter filter : filters) {
      maskedText = filter.filter(maskedText);
    }
    return maskedText;
  }
}
```

替换依赖的外部系统

```java

// 外部系统A
public interface IA {
  //...
  void fa();
}
public class A implements IA {
  //...
  public void fa() { //... }
}
// 在我们的项目中，外部系统A的使用示例
public class Demo {
  private IA a;
  public Demo(IA a) {
    this.a = a;
  }
  //...
}
Demo d = new Demo(new A());

// 将外部系统A替换成外部系统B
public class BAdaptor implemnts IA {
  private B b;
  public BAdaptor(B b) {
    this.b= b;
  }
  public void fa() {
    //...
    b.fb();
  }
}
// 借助BAdaptor，Demo的代码中，调用IA接口的地方都无需改动，
// 只需要将BAdaptor如下注入到Demo即可。
Demo d = new Demo(new BAdaptor(new B()));
```

兼容老版本接口

适配不同格式的数据

### 门面模式

> 尽量保持接口的可复用性，但针对特殊情况，允许提供冗余的门面接口，来提供更易用的接口。

#### 门面模式的原理与实现

Provide a unified interface to a set of interfaces in a subsystem. Facade Pattern defines a higher-level interface that
makes the subsystem easier to use.

门面模式为子系统提供一组统一的接口，定义一组高层接口让子系统更易用。

解决性能问题

#### 门面模式的应用场景举例

#### 解决易用性问题

门面模式可以用来封装系统的底层实现，隐藏系统的复杂性，提供一组更加简单易用、更高层的接口。

#### 解决性能问题

通过将多个接口调用替换为一个门面接口调用，减少网络通信成本，提高 App 客户端的响应速度。

#### 解决分布式事务问题

可以借鉴门面模式的思想，再设计一个包裹这两个操作的新接口，让新接口在一个事务中执行两个 SQL 操作。重点回顾

### 组合模式

Compose objects into tree structure to represent part-whole hierarchies.Composite lets client treat individual objects
and compositions of objects uniformly.

将一组对象组织（Compose）成树形结构，以表示一种“部分 - 整体”的层次结构。组合让客户端（在很多设计模式书籍中，“客户端”代指代码的使用者。）可以统一单个对象和组合对象的处理逻辑。

```java
public abstract class FileSystemNode {
    protected String path;

    public FileSystemNode(String path) {
        this.path = path;
    }

    public abstract int countNumOfFiles();
    public abstract long countSizeOfFiles();

    public String getPath() {
        return path;
    }
}

public class File extends FileSystemNode {
    public File(String path) {
        super(path);
    }

    @Override
    public int countNumOfFiles() {
        return 1;
    }

    @Override
    public long countSizeOfFiles() {
        java.io.File file = new java.io.File(path);
        if (!file.exists()) {
            return 0;
        }
        return file.length();
    }
}

public class Directory extends FileSystemNode {
    private List<FileSystemNode> subNodes = new ArrayList<>();

    public Directory(String path) {
        super(path);
    }

    @Override
    public int countNumOfFiles() {
        int numOfFiles = 0;
        for (FileSystemNode fileOrDir : subNodes) {
            numOfFiles += fileOrDir.countNumOfFiles();
        }
        return numOfFiles;
    }

    @Override
    public long countSizeOfFiles() {
        long sizeOfFiles = 0;
        for (FileSystemNode fileOrDir : subNodes) {
            sizeOfFiles += fileOrDir.countSizeOfFiles();
        }
        return sizeOfFiles;
    }

    public void addSubNode(FileSystemNode fileOrDir) {
        subNodes.add(fileOrDir);
    }

    public void removeSubNode(FileSystemNode fileOrDir) {
        int size = subNodes.size();
        int i = 0;
        for (; i < size; ++i) {
            if (subNodes.get(i).getPath().equalsIgnoreCase(fileOrDir.getPath())) {
                break;
            }
        }
        if (i < size) {
            subNodes.remove(i);
        }
    }
}
```

#### 组合模式的应用场景

组合模式，将一组对象组织成树形结构，将单个对象和组合对象都看做树中的节点，以统一处理逻辑，并且它利用树形结构的特点，递归地处理每个子树，依次简化代码实现。

使用组合模式的前提在于，你的业务场景必须能够表示成树形结构。所以，组合模式的应用场景也比较局限，它并不是一种很常用的设计模式。

### 享元模式

享元模式的意图是复用对象，节省内存，前提是享元对象是不可变对象。

具体来讲，当一个系统中存在大量重复对象的时候，我们就可以利用享元模式，将对象设计成享元，在内存中只保留一份实例，供多处代码引用，这样可以减少内存中对象的数量，以起到节省内存的目的。

在单例模式中，一个类只能创建一个对象，而在享元模式中，一个类可以创建多个对象，每个对象被多处代码引用共享

```java
public class ChessPiece {
    private ChessPieceUnit chessPieceUnit;
    private int positionX;
    private int positionY;

    public ChessPiece(ChessPieceUnit chessPieceUnit, int positionX, int positionY) {
        this.chessPieceUnit = chessPieceUnit;
        this.positionX = positionX;
        this.positionY = positionY;
    }
}

public class ChessPieceUnit {
    private int id;
    private String text;
    private ChessPiece.Color color;

    public ChessPieceUnit(int id, String text, ChessPiece.Color color) {
        this.id = id;
        this.text = text;
        this.color = color;
    }

    public static enum Color {
        RED, BLACK
    }
}

public class ChessPieceUnitFactory {
    private static final Map<Integer, ChessPieceUnit> pieces = new HashMap<>();

    static {
        pieces.put(1, new ChessPieceUnit(1, "车", ChessPiece.Color.BLACK));
        pieces.put(2, new ChessPieceUnit(2, "马", ChessPiece.Color.RED));
    }

    public static ChessPieceUnit getChessPiece(int chessPieceId) {
        return pieces.get(chessPieceId);
    }
}

public class ChessBoard {
    private Map<Integer, ChessPiece> chessPieces = new HashMap<>();

    public ChessBoard() {
        init();
    }

    private void init() {
        chessPieces.put(1, new ChessPiece(ChessPieceUnitFactory.getChessPiece(1), 0, 0));
        chessPieces.put(2, new ChessPiece(ChessPieceUnitFactory.getChessPiece(2), 1, 0));
    }

    public void move(int chessPieceId, int toPositionX, int toPositionY) {

    }
}
```

享元模式在Java Integer的应用：IntegerCache类中预先创建好所有整型值 -128 - 127

享元模式在Java String的应用：JVM开辟一块存储区专门存储字符串常量

# 设计模式行为型

### 观察者模式

根据应用场景的不同，观察者模式会对应不同的代码实现方式：有同步阻塞的实现方式，也有异步非阻塞的实现方式；有进程内的实现方式，也有跨进程的实现方式

Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified
and updated automatically.

在对象之间定义一个一对多的依赖，当一个对象状态改变的时候，所有依赖的对象都会自动收到通知。

一般情况下，被依赖的对象叫作被观察者（Observable），依赖的对象叫作观察者（Observer）。

观察者模式，它是将观察者和被观察者代码解耦。

```java

public interface Subject {
  void registerObserver(Observer observer);
  void removeObserver(Observer observer);
  void notifyObservers(Message message);
}

public interface Observer {
  void update(Message message);
}

public class ConcreteSubject implements Subject {
  private List<Observer> observers = new ArrayList<Observer>();

  @Override
  public void registerObserver(Observer observer) {
    observers.add(observer);
  }

  @Override
  public void removeObserver(Observer observer) {
    observers.remove(observer);
  }

  @Override
  public void notifyObservers(Message message) {
    for (Observer observer : observers) {
      observer.update(message);
    }
  }

}

public class ConcreteObserverOne implements Observer {
  @Override
  public void update(Message message) {
    //TODO: 获取消息通知，执行自己的逻辑...
    System.out.println("ConcreteObserverOne is notified.");
  }
}

public class ConcreteObserverTwo implements Observer {
  @Override
  public void update(Message message) {
    //TODO: 获取消息通知，执行自己的逻辑...
    System.out.println("ConcreteObserverTwo is notified.");
  }
}

public class Demo {
  public static void main(String[] args) {
    ConcreteSubject subject = new ConcreteSubject();
    subject.registerObserver(new ConcreteObserverOne());
    subject.registerObserver(new ConcreteObserverTwo());
    subject.notifyObservers(new Message());
  }
}
```

### 模板模式

Define the skeleton of an algorithm in an operation, deferring some steps to subclasses. Template Method lets subclasses
redefine certain steps of an algorithm without changing the algorithm’s structure.

模板方法模式在一个方法中定义一个算法骨架，并将某些步骤推迟到子类中实现。模板方法模式可以让子类在不改变算法整体结构的情况下，重新定义算法中的某些步骤。

```java
public abstract class AbstractClass {
    public final void templateMethod() {
        //...
        method1();
        //...
        method2();
        //...
    }

    protected abstract void method1();
    protected abstract void method2();
}

public class ConcreteClass1 extends AbstractClass {
    @Override
    protected void method1() {
        //...
    }

    @Override
    protected void method2() {
        //...
    }
}

public class ConcreteClass2 extends AbstractClass {
    @Override
    protected void method1() {
        //...
    }

    @Override
    protected void method2() {
        //...
    }
}
```

#### 作用

#### 复用

把一个算法中不变的流程抽象到父类的模板方法中，所有的子类都可以复用父类中模板方法定义的流程代码

第一种方式：父类中定义模板抽象方法，子类去实现

第二种方式：父类中定义非final方法，抛出UnsupportedOperationException，子类去重写

#### 扩展

通过对子类扩展点的实现，定制化实现，扩展框架

#### 回调 与 模板模式相同作用

同步回调指在函数返回之前执行回调函数；异步回调指的是在函数返回之后执行回调函数。

```java
public interface ICallback {
    void methodToCallback();
}

public class BClass {
    public void process(ICallback callback) {
        //...
        callback.methodToCallback();
        //...
    }
}

public class AClass {
    public static void main(String[] args) {
        BClass b = new BClass();
        b.process(new ICallback() {
            @Override
            public void methodToCallback() {
                System.out.println("Call back me.");
            }
        });
    }
}
```

回调基于组合关系来实现，把一个对象传递给另一个对象，是一种对象之间的关系；模板模式基于继承关系来实现，子类重写父类的抽象方法，是一种类之间的关系。

如果某个类中定义了多个模板方法，每个方法都有对应的抽象方法，那即便我们只用到其中的一个模板方法，子类也必须实现所有的抽象方法。而回调就更加灵活，我们只需要往用到的模板方法中注入回调对象即可。

回调可以使用匿名类来创建回调对象，可以不用事先定义类；而模板模式针对不同的实现都要定义不同的子类。

### 策略模式

Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary
independently from clients that use it.

定义一族算法类，将每个算法分别封装起来，让它们可以互相替换。策略模式可以使算法的变化独立于使用它们的客户端（这里的客户端代指使用算法的代码）。

客户端代码基于接口而非实现编程，可以灵活地替换不同的策略

```java
public interface Strategy {
    void algorithmInterface();
}

public class ConcreteStrategyA implements Strategy {
    @Override
    public void algorithmInterface() {

    }
}

public class ConcreteStrategyB implements Strategy {
    @Override
    public void algorithmInterface() {

    }
}

public class StrategyFactoryStateless {
    private static final Map<String, Strategy> strategies = new HashMap<>();

    static {
        strategies.put("A", new ConcreteStrategyA());
        strategies.put("B", new ConcreteStrategyB());
    }

    public static Strategy getStrategy(String type) {
        if (type == null || type.isEmpty()) {
            throw new IllegalArgumentException("type should not be empty.");
        }
        return strategies.get(type);
    }
}

public class StrategyFactoryState {
    public static Strategy getStrategy(String type) {
        if (type == null || type.isEmpty()) {
            throw new IllegalArgumentException("type should not be empty.");
        }

        if (type.equals("A")) {
            return new ConcreteStrategyA();
        } else if (type.equals("B")) {
            return new ConcreteStrategyB();
        }
        return null;
    }
}

public class StrategyService {
    public void execute(String type) {
//        Strategy strategy = StrategyFactoryState.getStrategy(type);
        Strategy strategy = StrategyFactoryStateless.getStrategy(type);
        strategy.algorithmInterface();
    }
}
```

一个完整的策略模式就是由这三个部分组成的。

* 策略类的定义比较简单，包含一个策略接口和一组实现这个接口的策略类。

* 策略的创建由工厂类来完成，封装策略创建的细节。

* 策略模式包含一组策略可选，客户端代码如何选择使用哪个策略，有两种确定方法：编译时静态确定和运行时动态确定。其中，“运行时动态确定”才是策略模式最典型的应用场景。

```java
public interface ISortAlg {
    void sort(String filePath);
}

public class QuickSort implements ISortAlg {
    @Override
    public void sort(String filePath) {

    }
}

public class ExternalSort implements ISortAlg {
    @Override
    public void sort(String filePath) {

    }
}

public class ConcurrentExternalSort implements ISortAlg {
    @Override
    public void sort(String filePath) {

    }
}

public class MapReduceSort implements ISortAlg {
    @Override
    public void sort(String filePath) {

    }
}

public class SortAlgFactory {
    private static final Map<String, ISortAlg> algs = new HashMap<>();

    static {
        algs.put("QuickSort", new QuickSort());
        algs.put("ExternalSort", new ExternalSort());
        algs.put("ConcurrentExternalSort", new ConcurrentExternalSort());
        algs.put("MapReduceSort", new MapReduceSort());
    }

    public static ISortAlg getSortAlg(String type) {
        if (type == null || type.isEmpty()) {
            throw new IllegalArgumentException("type should not be empty.");
        }
        return algs.get(type);
    }
}

public class Sorter {
    private static final long GB = 1000 * 1000 * 1000;
    private static final List<AlgRange> algs = new ArrayList<>();

    static {
        algs.add(new AlgRange(0, 6 * GB, SortAlgFactory.getSortAlg("QuickSort")));
        algs.add(new AlgRange(6 * GB, 10 * GB, SortAlgFactory.getSortAlg("ExternalSort")));
        algs.add(new AlgRange(10*GB, 100*GB, SortAlgFactory.getSortAlg("ConcurrentExternalSort")));
        algs.add(new AlgRange(100*GB, Long.MAX_VALUE, SortAlgFactory.getSortAlg("MapReduceSort")));
    }

    public void sortFile(String filePath) {
        File file = new File(filePath);
        long fileSize = file.length();
        ISortAlg sortAlg = null;
        for (AlgRange algRange : algs) {
            if (algRange.inRange(fileSize)) {
                sortAlg = algRange.getAlg();
                break;
            }
        }
        sortAlg.sort(filePath);
    }

    private static class AlgRange {
        private long start;
        private long end;
        private ISortAlg alg;

        public AlgRange(long start, long end, ISortAlg alg) {
            this.start = start;
            this.end = end;
            this.alg = alg;
        }

        public ISortAlg getAlg() {
            return alg;
        }

        public boolean inRange(long size) {
            return size >= start && size < end;
        }
    }
}
```

### 职责链模式

Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request.
Chain the receiving objects and pass the request along the chain until an object handles it.

将请求的发送和接收解耦，让多个接收对象都有机会处理这个请求。将这些接收对象串成一条链，并沿着这条链传递这个请求，直到链上的某个接收对象能够处理它为止。

链表

```java
public abstract class Handler {
    protected Handler successor = null;

    public void setSuccessor(Handler successor) {
        this.successor = successor;
    }

    public final void handle() {
        doHandle();
        if (successor != null) {
            successor.handle();
        }
    }

    protected abstract void doHandle();
}

public class HandlerA extends Handler{
    @Override
    protected void doHandle() {

    }
}

public class HandlerB extends Handler {
    @Override
    protected void doHandle() {

    }
}

public class HandlerChain {
    private Handler head = null;
    private Handler tail = null;

    public void addHandler(Handler handler) {
        handler.setSuccessor(null);

        if (handler == null) {
            head = handler;
            tail = handler;
            return;
        }
        tail.setSuccessor(handler);
        tail = handler;
    }

    public void handle() {
        if (head != null) {
            head.handle();
        }
    }
}

public class Application {
    public static void main(String[] args) {
        HandlerChain chain = new HandlerChain();
        chain.addHandler(new HandlerA());
        chain.addHandler(new HandlerB());
        chain.handle();
    }
}
```

数组

```java
public interface IHandler {
    boolean handle();
}

public class HandlerM implements IHandler {
    @Override
    public boolean handle() {
        boolean handled = false;
        //...
        return handled;
    }
}

public class HandlerN implements IHandler {
    @Override
    public boolean handle() {
        boolean handled = false;
        //...
        return handled;
    }
}

public class HandlerChain {
    private List<IHandler> handlers = new ArrayList<>();

    public void addHandler(IHandler handler) {
        this.handlers.add(handler);
    }

    public void handle() {
        for (IHandler handler : handlers) {
            boolean handled = handler.handle();
            if (handled) {
                break;
            }
        }
    }
}

public class Application {
    public static void main(String[] args) {
        HandlerChain chain = new HandlerChain();
        chain.addHandler(new HandlerM());
        chain.addHandler(new HandlerN());
        chain.handle();
    }
}
```

### 状态模式

状态模式一般用来实现状态机，而状态机常用在游戏、工作流引擎等系统开发中。

状态模式通过将事件触发的状态转移和动作执行，拆分到不同的状态类中，来避免分支判断逻辑。

对于状态并不多、状态转移也比较简单，但事件触发执行的动作包含的业务逻辑可能比较复杂的状态机来说

```java
public interface IMario {
    State getName();
    void obtainMushRoom(MarioStateMachine stateMachine);
    void obtainCape(MarioStateMachine stateMachine);
    void obtainFireFlower(MarioStateMachine stateMachine);
    void meetMonster(MarioStateMachine stateMachine);
}

public class SmallMario implements IMario {
    private static final SmallMario instance = new SmallMario();
    private SmallMario() {}
    public static SmallMario getInstance() {
        return instance;
    }

    @Override
    public State getName() {
        return State.SMALL;
    }

    @Override
    public void obtainMushRoom(MarioStateMachine stateMachine) {
        stateMachine.setCurrentState(SuperMario.getInstance());
        stateMachine.setScore(stateMachine.getScore() + 100);
    }

    @Override
    public void obtainCape(MarioStateMachine stateMachine) {
        stateMachine.setCurrentState(CapeMario.getInstance());
        stateMachine.setScore(stateMachine.getScore() + 200);
    }

    @Override
    public void obtainFireFlower(MarioStateMachine stateMachine) {
        stateMachine.setCurrentState(FireMario.getInstance());
        stateMachine.setScore(stateMachine.getScore() + 300);
    }

    @Override
    public void meetMonster(MarioStateMachine stateMachine) {

    }
}

public class SuperMario implements IMario {
    private static final SuperMario instance = new SuperMario();

    public SuperMario() {
    }

    public static SuperMario getInstance() {
        return instance;
    }

    @Override
    public State getName() {
        return State.SUPER;
    }

    @Override
    public void obtainMushRoom(MarioStateMachine stateMachine) {

    }

    @Override
    public void obtainCape(MarioStateMachine stateMachine) {
        stateMachine.setCurrentState(CapeMario.getInstance());
        stateMachine.setScore(stateMachine.getScore() + 200);
    }

    @Override
    public void obtainFireFlower(MarioStateMachine stateMachine) {
        stateMachine.setCurrentState(FireMario.getInstance());
        stateMachine.setScore(stateMachine.getScore() + 300);
    }

    @Override
    public void meetMonster(MarioStateMachine stateMachine) {
        stateMachine.setCurrentState(SmallMario.getInstance());
        stateMachine.setScore(stateMachine.getScore() - 100);
    }
}

public class CapeMario implements IMario {
    private static final CapeMario instance = new CapeMario();

    public CapeMario() {}

    public static CapeMario getInstance() {
        return instance;
    }

    @Override
    public State getName() {
        return State.CAPE;
    }

    @Override
    public void obtainMushRoom(MarioStateMachine stateMachine) {
        stateMachine.setCurrentState(SuperMario.getInstance());
        stateMachine.setScore(stateMachine.getScore() + 100);
    }

    @Override
    public void obtainCape(MarioStateMachine stateMachine) {

    }

    @Override
    public void obtainFireFlower(MarioStateMachine stateMachine) {
        stateMachine.setCurrentState(FireMario.getInstance());
        stateMachine.setScore(stateMachine.getScore() + 300);
    }

    @Override
    public void meetMonster(MarioStateMachine stateMachine) {
        stateMachine.setCurrentState(SmallMario.getInstance());
        stateMachine.setScore(stateMachine.getScore() - 100);
    }
}

public class FireMario implements IMario {
    private static final FireMario instance = new FireMario();

    public FireMario() {
    }

    public static FireMario getInstance() {
        return instance;
    }

    @Override
    public State getName() {
        return State.FIRE;
    }

    @Override
    public void obtainMushRoom(MarioStateMachine stateMachine) {
        stateMachine.setCurrentState(SuperMario.getInstance());
        stateMachine.setScore(stateMachine.getScore() + 100);
    }

    @Override
    public void obtainCape(MarioStateMachine stateMachine) {
        stateMachine.setCurrentState(CapeMario.getInstance());
        stateMachine.setScore(stateMachine.getScore() + 200);
    }

    @Override
    public void obtainFireFlower(MarioStateMachine stateMachine) {

    }

    @Override
    public void meetMonster(MarioStateMachine stateMachine) {
        stateMachine.setCurrentState(SmallMario.getInstance());
        stateMachine.setScore(stateMachine.getScore() - 100);
    }
}

public class MarioStateMachine {
    private int score;
    private IMario currentState;

    public MarioStateMachine() {
        this.score = 0;
        this.currentState = SmallMario.getInstance();
    }

    public void obtainMushRoom() {
        this.currentState.obtainMushRoom(this);
    }

    public void obtainCape() {
        this.currentState.obtainCape(this);
    }

    public void obtainFireFlower() {
        this.currentState.obtainFireFlower(this);
    }

    public void meetMonster() {
        this.currentState.meetMonster(this);
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public State getCurrentState() {
        return this.currentState.getName();
    }

    public void setCurrentState(IMario currentState) {
        this.currentState = currentState;
    }
}

public class ApplicationDemo {
    public static void main(String[] args) {
        MarioStateMachine mario = new MarioStateMachine();
        mario.obtainMushRoom();
        int score = mario.getScore();
        State state = mario.getCurrentState();
        System.out.println("mario score: " + score + "; state: " + state);
    }
}
```

### 迭代器模式

迭代器模式将集合对象的遍历操作从集合类中拆分出来，放到迭代器类中，让两者的职责更加单一。

利用迭代器来遍历有下面三个优势：

* 迭代器模式封装集合内部的复杂数据结构，开发者不需要了解如何遍历，直接使用容器提供的迭代器即可；

* 迭代器模式将集合对象的遍历操作从集合类中拆分出来，放到迭代器类中，让两者的职责更加单一；

* 迭代器模式让添加新的遍历算法更加容易，更符合开闭原则。除此之外，因为迭代器都实现自相同的接口，在开发中，基于接口而非实现编程，替换迭代器也变得更加容易。

```java
public interface Iterator<E> {
    boolean hasNext();
    void next();
    E currentItem();
}

public class ArrayIterator<E> implements Iterator<E> {
    private int cursor;
    private ArrayList<E> arrayList;

    public ArrayIterator(ArrayList<E> arrayList) {
        this.cursor = 0;
        this.arrayList = arrayList;
    }

    @Override
    public boolean hasNext() {
        return cursor != arrayList.size();
    }

    @Override
    public void next() {
        cursor++;
    }

    @Override
    public E currentItem() {
        if (cursor >= arrayList.size()) {
            throw new NoSuchElementException();
        }
        return arrayList.get(cursor);
    }
}

public class Demo {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<>();
        names.add("xzg");
        names.add("wang");
        names.add("zheng");

        Iterator<String> iterator = new ArrayIterator<>(names);
        while (iterator.hasNext()) {
            System.out.println(iterator.currentItem());
            iterator.next();
        }
    }
}
```

### 访问者模式

Allows for one or more operation to be applied to a set of objects at runtime, decoupling the operations from the object
structure.

允许一个或者多个操作应用到一组对象上，解耦操作和对象本身。

一般来说，访问者模式针对的是一组类型不同的对象（PdfFile、PPTFile、WordFile）。不过，尽管这组对象的类型是不同的，但是，它们继承相同的父类（ResourceFile）或者实现相同的接口。在不同的应用场景下，我们需要对这组对象进行一系列不相关的业务操作（抽取文本、压缩等），但为了避免不断添加功能导致类（PdfFile、PPTFile、WordFile）不断膨胀，职责越来越不单一，以及避免频繁地添加功能导致的频繁代码修改，我们使用访问者模式，将对象与操作解耦，将这些业务操作抽离出来，定义在独立细分的访问者类（Extractor、Compressor）中。

```java
public interface Visitor {
    void visit(PdfFile pdfFile);
    void visit(PptFile pptFile);
    void visit(WordFile wordFile);
}

public class Compressor implements Visitor {
    @Override
    public void visit(PdfFile pdfFile) {
        //...
        System.out.println("compress pdfFile.");
    }

    @Override
    public void visit(PptFile pptFile) {
        //...
        System.out.println("compress pptFile.");
    }

    @Override
    public void visit(WordFile wordFile) {
        //...
        System.out.println("compress wordFile.");
    }
}

public class Extractor implements Visitor {
    @Override
    public void visit(PdfFile pdfFile) {
        //...
        System.out.println("Extract PDF.");
    }

    @Override
    public void visit(PptFile pptFile) {
        //...
        System.out.println("Extract PPT.");
    }

    @Override
    public void visit(WordFile wordFile) {
        //...
        System.out.println("Extract WORD.");
    }
}

public abstract class ResourceFile {
    protected String filePath;

    public ResourceFile(String filePath) {
        this.filePath = filePath;
    }

    public abstract void accept(Visitor visitor);
}

public class PdfFile extends ResourceFile {
    public PdfFile(String filePath) {
        super(filePath);
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}

public class PptFile extends ResourceFile {
    public PptFile(String filePath) {
        super(filePath);
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}

public class WordFile extends ResourceFile {
    public WordFile(String filePath) {
        super(filePath);
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}

public class ToolApplication {
    public static void main(String[] args) {
        Extractor extractor = new Extractor();
        List<ResourceFile> resourceFiles = listAllResourceFiles(args[0]);
        for (ResourceFile resourceFile : resourceFiles) {
            resourceFile.accept(extractor);
        }
        Compressor compressor = new Compressor();
        for (ResourceFile resourceFile : resourceFiles) {
            resourceFile.accept(compressor);
        }
    }
    private static List<ResourceFile> listAllResourceFiles(String resourceDirectory) {
        List<ResourceFile> resourceFiles = new ArrayList<>();
        resourceFiles.add(new PdfFile("a.pdf"));
        resourceFiles.add(new PptFile("b.ppt"));
        resourceFiles.add(new WordFile("c.word"));
        return resourceFiles;
    }
}
```

### 备忘录模式

Captures and externalizes an object’s internal state so that it can be restored later, all without violating
encapsulation.

在不违背封装原则的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，以便之后恢复对象为先前的状态。

一部分是，存储副本以便后期恢复；另一部分是，要在不违背封装原则的前提下，进行对象的备份和恢复

全量备份和增量备份相结合，低频全量备份，高频增量备份，两者结合来做恢复。

```java
public class Snapshot {
    private String text;

    public Snapshot(String text) {
        this.text = text;
    }

    public String getText() {
        return this.text;
    }
}

public class InputText {
    private StringBuilder text = new StringBuilder();

    public String getText() {
        return text.toString();
    }

    public void append(String input) {
        text.append(input);
    }

    public Snapshot createSnapshot() {
        return new Snapshot(text.toString());
    }

    public void restoreSnapshot(Snapshot snapshot) {
        this.text.replace(0, this.text.length(), snapshot.getText());
    }
}

public class SnapshotHolder {
    private Stack<Snapshot> snapshots = new Stack<>();

    public Snapshot popSnapshot() {
        return snapshots.pop();
    }

    public void pushSnapshot(Snapshot snapshot) {
        snapshots.push(snapshot);
    }
}

public class ApplicationMain {
    public static void main(String[] args) {
        InputText inputText = new InputText();
        SnapshotHolder snapshotHolder = new SnapshotHolder();
        Scanner scanner = new Scanner(System.in);
        while (scanner.hasNext()) {
            String input = scanner.next();
            if (Objects.equals(input, ":list")) {
                System.out.println(inputText.getText());
            } else if (Objects.equals(input, ":undo")) {
                Snapshot snapshot = snapshotHolder.popSnapshot();
                inputText.restoreSnapshot(snapshot);
            } else {
                snapshotHolder.pushSnapshot(inputText.createSnapshot());
                inputText.append(input);
            }
        }
    }
}
```

### 命令模式

The command pattern encapsulates a request as an object, thereby letting us parameterize other objects with different
requests, queue or log requests, and support undoable operations.

命令模式将请求（命令）封装为一个对象，这样可以使用不同的请求参数化其他对象（将不同请求依赖注入到其他对象），并且能够支持请求（命令）的排队执行、记录日志、撤销等（附加控制）功能。

```java

public interface Command {
  void execute();
}

public class GotDiamondCommand implements Command {
  // 省略成员变量

  public GotDiamondCommand(/*数据*/) {
    //...
  }

  @Override
  public void execute() {
    // 执行相应的逻辑
  }
}
//GotStartCommand/HitObstacleCommand/ArchiveCommand类省略

public class GameApplication {
  private static final int MAX_HANDLED_REQ_COUNT_PER_LOOP = 100;
  private Queue<Command> queue = new LinkedList<>();

  public void mainloop() {
    while (true) {
      List<Request> requests = new ArrayList<>();
      
      //省略从epoll或者select中获取数据，并封装成Request的逻辑，
      //注意设置超时时间，如果很长时间没有接收到请求，就继续下面的逻辑处理。
      
      for (Request request : requests) {
        Event event = request.getEvent();
        Command command = null;
        if (event.equals(Event.GOT_DIAMOND)) {
          command = new GotDiamondCommand(/*数据*/);
        } else if (event.equals(Event.GOT_STAR)) {
          command = new GotStartCommand(/*数据*/);
        } else if (event.equals(Event.HIT_OBSTACLE)) {
          command = new HitObstacleCommand(/*数据*/);
        } else if (event.equals(Event.ARCHIVE)) {
          command = new ArchiveCommand(/*数据*/);
        } // ...一堆else if...

        queue.add(command);
      }

      int handledCount = 0;
      while (handledCount < MAX_HANDLED_REQ_COUNT_PER_LOOP) {
        if (queue.isEmpty()) {
          break;
        }
        Command command = queue.poll();
        command.execute();
      }
    }
  }
}
```

### 解释器模式

Interpreter pattern is used to defines a grammatical representation for a language and provides an interpreter to deal
with this grammar.

解释器模式为某个语言定义它的语法（或者叫文法）表示，并定义一个解释器用来处理这个语法。

```java
public interface Expression {
    long interpret();
}

public class NumberExpression implements Expression {
    private long number;

    public NumberExpression(long number) {
        this.number = number;
    }

    public NumberExpression(String number) {
        this.number = Long.parseLong(number);
    }

    @Override
    public long interpret() {
        return this.number;
    }
}

public class AdditionExpression implements Expression {
    private Expression exp1;
    private Expression exp2;

    public AdditionExpression(Expression exp1, Expression exp2) {
        this.exp1 = exp1;
        this.exp2 = exp2;
    }

    @Override
    public long interpret() {
        return exp1.interpret() + exp2.interpret();
    }
}

public class ExpressionInterpreter {
    private Deque<Expression> numbers = new LinkedList<>();

    public long interpret(String expression) {
        String[] elements = expression.split(" ");
        int length = elements.length;
        for (int i = 0; i < (length + 1) / 2; ++i) {
            numbers.addLast(new NumberExpression(elements[i]));
        }

        for (int i = (length + 1) / 2; i < length; ++i) {
            String operator = elements[i];
            boolean isValid = "+".equals(operator) || "-".equals(operator) || "*".equals(operator) || "/".equals(operator);
            if (!isValid) {
                throw new RuntimeException("Expression is invalid: " + expression);
            }

            Expression exp1 = numbers.pollFirst();
            Expression exp2 = numbers.pollFirst();
            Expression combinedExp = null;
            if (operator.equals("+")) {
                combinedExp = new AdditionExpression(exp1, exp2);
            } else if (operator.equals("-")) {
                combinedExp = new AdditionExpression(exp1, exp2);
            } else if (operator.equals("*")) {
                combinedExp = new AdditionExpression(exp1, exp2);
            } else if (operator.equals("/")) {
                combinedExp = new AdditionExpression(exp1, exp2);
            }
            long result = combinedExp.interpret();
            numbers.addFirst(new NumberExpression(result));
        }

        if (numbers.size() != 1) {
            throw new RuntimeException("Expression is invalid: " + expression);
        }

        return numbers.pop().interpret();
    }
}
```

### 中介模式

Mediator pattern defines a separate (mediator) object that encapsulates the interaction between a set of objects and the
objects delegate their interaction to a mediator object instead of interacting with each other directly.

中介模式定义了一个单独的（中介）对象，来封装一组对象之间的交互。将这组对象之间的交互委派给与中介对象交互，来避免对象之间的直接交互。

```java

public interface Mediator {
  void handleEvent(Component component, String event);
}

public class LandingPageDialog implements Mediator {
  private Button loginButton;
  private Button regButton;
  private Selection selection;
  private Input usernameInput;
  private Input passwordInput;
  private Input repeatedPswdInput;
  private Text hintText;

  @Override
  public void handleEvent(Component component, String event) {
    if (component.equals(loginButton)) {
      String username = usernameInput.text();
      String password = passwordInput.text();
      //校验数据...
      //做业务处理...
    } else if (component.equals(regButton)) {
      //获取usernameInput、passwordInput、repeatedPswdInput数据...
      //校验数据...
      //做业务处理...
    } else if (component.equals(selection)) {
      String selectedItem = selection.select();
      if (selectedItem.equals("login")) {
        usernameInput.show();
        passwordInput.show();
        repeatedPswdInput.hide();
        hintText.hide();
        //...省略其他代码
      } else if (selectedItem.equals("register")) {
        //....
      }
    }
  }
}

public class UIControl {
  private static final String LOGIN_BTN_ID = "login_btn";
  private static final String REG_BTN_ID = "reg_btn";
  private static final String USERNAME_INPUT_ID = "username_input";
  private static final String PASSWORD_INPUT_ID = "pswd_input";
  private static final String REPEATED_PASSWORD_INPUT_ID = "repeated_pswd_input";
  private static final String HINT_TEXT_ID = "hint_text";
  private static final String SELECTION_ID = "selection";

  public static void main(String[] args) {
    Button loginButton = (Button)findViewById(LOGIN_BTN_ID);
    Button regButton = (Button)findViewById(REG_BTN_ID);
    Input usernameInput = (Input)findViewById(USERNAME_INPUT_ID);
    Input passwordInput = (Input)findViewById(PASSWORD_INPUT_ID);
    Input repeatedPswdInput = (Input)findViewById(REPEATED_PASSWORD_INPUT_ID);
    Text hintText = (Text)findViewById(HINT_TEXT_ID);
    Selection selection = (Selection)findViewById(SELECTION_ID);

    Mediator dialog = new LandingPageDialog();
    dialog.setLoginButton(loginButton);
    dialog.setRegButton(regButton);
    dialog.setUsernameInput(usernameInput);
    dialog.setPasswordInput(passwordInput);
    dialog.setRepeatedPswdInput(repeatedPswdInput);
    dialog.setHintText(hintText);
    dialog.setSelection(selection);

    loginButton.setOnClickListener(new OnClickListener() {
      @Override
      public void onClick(View v) {
        dialog.handleEvent(loginButton, "click");
      }
    });

    regButton.setOnClickListener(new OnClickListener() {
      @Override
      public void onClick(View v) {
        dialog.handleEvent(regButton, "click");
      }
    });

    //....
  }
}
```

# 规范与重构

> 创建型设计模式主要解决“对象的创建”问题，
> 结构型设计模式主要解决“类或对象的组合或组装”问题，
> 行为型设计模式主要解决的就是“类或对象之间的交互”问题。

> 设计模式要干的事情就是解耦。
> 创建型模式是将创建和使用代码解耦，
> 结构型模式是将不同功能代码解耦，
> 行为型模式是将不同的行为代码解耦

### 为什么要重构

* 重构是一种对软件内部结构的改善，目的是在不改变软件的可见行为的情况下，使其更易理解，修改成本更低

* 重构是避免过度设计的有效手段

### 到底重构什么

* 大规模高层次、小规模低层次

* 大型重构是对顶层代码设计的重构

    * 代码分层，模块化，解耦

* 小型重构是对代码细节的重构

    * 规范命名，注释，提取重复代码

### 什么时候重构

* 持续重构

### 如何重构

* 完善的重构计划

### 什么是单元测试

测试对象是类或函数，用来测试一个类和函数是否都按照预期的逻辑执行，是代码层级的测试

* 单元测试能有效地发现代码中的bug

* 写单元测试能发现代码测试上的问题

* 单元测试是对集成测试的有力补充

* 写单元测试的过程本身就是代码重构的过程

* 阅读单元测试可以快速熟悉代码

### Anti-Patterns

* 未决行为，代码的输出是随机的，时间，随机数

* 全局变量

* 静态方法，只有静态方法耗时太长，依赖外部资源，逻辑复杂，行为未决，才去mock

* 复杂继承

* 高耦合代码

### 如何给代码解耦

* 封装与抽象

    * 封装和抽象可以有效地隐藏实现的复杂性，隔离实现的易变性，给依赖的模块提供稳定且易用的抽象接口

* 中间层

    * 引入中间层能简化模块或类之间的依赖关系

    * 第一阶段：引入一个中间层，包裹老的接口，提供新的接口定义

    * 第二阶段：新开发的代码依赖中间层提供的新接口

    * 第三阶段：将依赖老接口的代码改为调用新接口

    * 第四阶段：确保所有的代码都调用新接口之后，删除掉老的接口

* 模块化

    * 分而治之

* 其他设计思想与原则

    * 单一职责原则

    * 基于接口而非实现编程

    * 依赖注入

    * 多用组合少用继承

    * 迪米特法则

### 代码规范

* 命名

    * 准确达意

    * 利用上下文简化命名

    * 可读，可搜索

* 注释

    * 做什么，为什么，怎么做

    * 总结，文档

    * 类和函数写注释

* 代码风格

    * 类，函数一屏

    * 一行代码最长屏宽

    * 善用空行分割单元块

* 编程技巧

    * 把代码分割成更小的单元块

    * 避免函数参数过多

        * 拆分成多个函数

        * 参数封装成对象

    * 勿用函数参数来控制逻辑

        * 不要在函数中使用布尔类型的标识参数来控制内部逻辑

        * 不要用根据参数为null来控制逻辑

    * 函数设计要职责单一

    * 移除过深的嵌套层次

    * 学会使用解释性变量

        * 常量取代魔法数字

        * 使用解释性变量来解释复杂表达式


> 单元测试用例如何写，关键看你如何定义函数

### 异常处理

* 使用异常处理程序出错的情况

* 返回空对象

* 抛出异常对象


# 高质量代码标准

### 可维护性（maintainability）

如果 bug 容易修复，修改、添加功能能够轻松完成，那我们就可以主观地认为代码对我们来说易维护

### 可读性（readability）

Any fool can write code that a computer can understand. Good programmers write code that humans can understand.

我们需要看代码是否符合编码规范、命名是否达意、注释是否详尽、函数是否长短合适、模块划分是否清晰、是否符合高内聚低耦合

### 可扩展性（extensibility）

代码预留了一些功能扩展点，你可以把新功能代码，直接插到扩展点上，而不需要因为要添加一个功能而大动干戈，改动大量的原始代码

### 灵活性（flexibility）

如果一段代码易扩展、易复用或者易用，我们都可以称这段代码写得比较灵活

### 简洁性（simplicity）

思从深而行从简，真正的高手能云淡风轻地用最简单的方法解决最复杂的问题

### 可复用性（reusability）

尽量减少重复代码的编写，复用已有的代码

### 可测试性（testability）

代码可测试性的好坏，能从侧面上非常准确地反应代码质量的好坏

### 如何写出高质量的代码

要写出高质量代码，我们就需要掌握一些更加细化、更加能落地的编程方法论，这就包含面向对象设计思想、设计原则、设计模式、编码规范、重构技巧等等

## 开源项目实战

* 工厂模式是用来创建不同但是相关类型的对象（继承同一父类或者接口的一组子类），由给定的参数来决定创建哪种类型的对象。建造者模式用来创建一种类型的复杂对象，通过设置不同的可选参数，“定制化”地创建不同的对象。

* 设计原则与思想角度应对复杂项目

    * 封装与抽象

    * 分层与模块化

    * 基于接口通信

    * 高内聚，松耦合

    * 为扩展而设计

    * KISS 首要原则

    * 最小惊奇原则(遵守开发规范)

* 研发管理和开发技巧角度应对复杂项目

    * 吹毛求疵般地执行编码规范

    * 编写高质量的单元测试

    * 不流于形式的Code Review

    * 开发未动，文档先行

    * 持续重构、重构、重构

    * 对项目与团队进行拆分

* Spring 框架蕴含的设计思想

    * 约定优于配置

    * 低侵入、松耦合

    * 模块化、轻量级

    * 再封装、再抽象
