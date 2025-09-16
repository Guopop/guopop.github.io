# swift 开发从零到一

[Develop in Swift](https://developer.apple.com/tutorials/develop-in-swift/)

[Source control management](https://developer.apple.com/documentation/xcode/source-control-management)

`.background` 使用研究

[Adding a background to your view](https://developer.apple.com/documentation/swiftui/adding-a-background-to-your-view)

[Exploring the structure of a SwiftUI app](https://developer.apple.com/tutorials/swiftui-concepts/exploring-the-structure-of-a-swiftui-app)

[Design with SwiftUI](https://developer.apple.com/videos/play/wwdc2023/10115/)

`.font` 使用研究

[Laying Out Views](https://developer.apple.com/tutorials/sample-apps/layingoutviews)

[Laying out a simple view](https://developer.apple.com/documentation/swiftui/laying-out-a-simple-view)

[Maintaining the adaptable sizes of built-in views](https://developer.apple.com/tutorials/swiftui-concepts/maintaining-the-adaptable-sizes-of-built-in-views)

[Buttons design](https://developer.apple.com/design/human-interface-guidelines/buttons)

[Demystify SwiftUI](https://developer.apple.com/videos/play/wwdc2021/10022/)

`.clipShape` 使用研究

[Managing user interface state](https://developer.apple.com/documentation/swiftui/managing-user-interface-state)

[Lists and tables](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables)

[Text fields](https://developer.apple.com/design/human-interface-guidelines/text-fields)

`Identifiable` protocol 了解

`mutating` 关键字 了解

[Defining and Calling Asynchronous Functions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/#Defining-and-Calling-Asynchronous-Functions)

[Propagating Errors Using Throwing Functions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/#Propagating-Errors-Using-Throwing-Functions)

[Meet Swift Testing](https://developer.apple.com/videos/play/wwdc2024/10179/)

[Determining how much code your tests cover](https://developer.apple.com/documentation/xcode/determining-how-much-code-your-tests-cover)

[Go further with Swift Testing](https://developer.apple.com/videos/play/wwdc2024/10195/)

`@MainActor` macro 了解

[Optional](https://developer.apple.com/documentation/swift/optional#Unconditional-Unwrapping)

[Build an app with SwiftData](https://developer.apple.com/videos/play/wwdc2023/10154/)

[Preserving your app’s model data across launches](https://developer.apple.com/documentation/swiftdata/preserving-your-apps-model-data-across-launches)

[Managing model data in your app](https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app)

[Exploring SwiftUI Sample Apps](https://developer.apple.com/tutorials/Sample-Apps)

[Sample Code Library](https://developer.apple.com/documentation/SampleCode)

[EnvironmentValues](https://developer.apple.com/documentation/swiftui/environmentvalues)

[SwiftUI Environment：理念与实践](https://fatbobman.com/zh/posts/swiftui-environment-concepts-and-practice/)

[新框架、新思维：解析 Observation 和 SwiftData 框架](https://fatbobman.com/zh/posts/new-frameworks-new-mindset/)

[避免 SwiftUI 视图的重复计算](https://fatbobman.com/zh/posts/avoid_repeated_calculations_of_swiftui_views/)

[SwiftUI 视图的生命周期研究](https://fatbobman.com/zh/posts/swiftuilifecycle/)

[了解 SwiftUI 的 onChange](https://fatbobman.com/zh/posts/onchange/)

[深度解读 Observation —— SwiftUI 性能提升的新途径](https://fatbobman.com/zh/posts/mastering-observation/)

[揭秘 SwiftData 的数据建模原理](https://fatbobman.com/zh/posts/unveiling-the-data-modeling-principles-of-swiftdata/)

[SwiftData 中的并发编程](https://fatbobman.com/zh/posts/concurret-programming-in-swiftdata/)

[SwiftData 实战：用现代方法构建 SwiftUI 应用](https://fatbobman.com/zh/posts/practical-swiftdata-building-swiftui-applications-with-modern-approaches/)

`Actor 类型` 了解

[swiftData pridicate demo](https://gist.github.com/fatbobman/6dc873ae18bb28cd1ccc521b3f56cefb?utm_source=Fatbobman%20Blog&utm_medium=web)

[构建类型安全、高效的 SwiftData/Core Data 模型](https://fatbobman.com/zh/posts/building-typesafe-highperformance-swiftdata-core-data-models/)

在使用 SwiftData 构建数据模型时，初学者应注意以下几点：

- 优先使用基础类型：如 Int、Double、Date、URL、String 等，作为模型的属性类型。
- 选择稳定的复杂类型：对于符合 Codable 协议的复杂类型，尽量选择广泛使用且格式稳定的类型，例如 CGPoint、CLLocation。
- 谨慎使用自定义 Codable 类型：除非确定不会再调整，否则尽量避免直接使用自定义的 Codable 类型。
- 枚举类型的使用：具有 RawValue 的枚举类型可以直接使用。
- 处理复杂 Codable 类型：对于尚未定型或较复杂的 Codable 类型，建议手动将其转换为基础类型进行保存，并通过计算属性简化读写操作。
- 排序与筛选的限制：Codable 类型中的属性可以用于排序，但不能用于筛选条件。如果某些属性需要作为筛选条件，建议将其抽象为单独的实体，并通过关系进行关联。
- 属性与关系的可选性：尽量将属性设置为可选类型或提供默认值，同时建议将关系也设置为可选类型。
- 避免在初始化方法中赋值关系属性：SwiftData 采用先创建对象、后插入上下文的模式，因此不要在模型的初始化方法中直接为关系属性赋值。

遵循以上建议，可以有效降低未来因模型调整带来的兼容性问题。

由于 CloudKit 和 SwiftData 的数据格式并非完全一致，为确保本地数据与云端兼容，创建 SwiftData 模型时需遵循以下原则：

- 避免使用唯一性约束：不要使用 @Attribute(.unique)。
- 属性需为可选类型或提供默认值：所有属性必须支持可选或具备默认值。
- 关系的删除规则限制：不支持将关系的删除规则设置为 Deny。
- 关系必须为可选类型：所有关系属性需定义为可选类型。
 
一旦启用 SwiftData 的内置云同步功能，任何破坏轻量迁移兼容性的模型更改都是不允许的。开发者应在项目初期就明确这一点。

[精确掌控 SwiftUI 滚动：自定义 Paging 实现](https://fatbobman.com/zh/posts/mastering-swiftui-scrolling-implementing-custom-paging/)

[在 SwiftData 和 Core Data 中用 Transaction 代替 Save](https://fatbobman.com/zh/posts/using-transactions-instead-of-save-in-swiftdata-and-core-data/)

[Swifter and Swifty：掌握 Swift Testing 框架](https://fatbobman.com/zh/posts/mastering-the-swift-testing-framework/)

[SwiftUI 滚动控制 API 的发展历程与 WWDC 2024 的新亮点](https://fatbobman.com/zh/posts/the-evolution-of-swiftui-scroll-control-apis/)

[深入探索 SwiftUI 中的 Overlay 和 Background 修饰器](https://fatbobman.com/zh/posts/in-depth-exploration-of-overlay-and-background-modifiers-in-swiftui/)

[SwiftUI 布局 —— 对齐](https://fatbobman.com/zh/posts/layout-alignment/)

[SwiftUI 布局 —— 尺寸（ 上 ）](https://fatbobman.com/zh/posts/layout-dimensions-1/)

[SwiftUI 布局 —— 尺寸（ 下 ）](https://fatbobman.com/zh/posts/layout-dimensions-2/)

[掌握 SwiftUI 的 Safe Area](https://fatbobman.com/zh/posts/safearea/)

[dynamicHeightSheet.swift](https://gist.github.com/fatbobman/8b4a17e94fd14653b48f3454b847f640?utm_source=Fatbobman%20Blog&utm_medium=web)

[SwiftUI 视图与 @MainActor](https://fatbobman.com/zh/posts/swiftui-views-and-mainactor/)

[如何为 SwiftData 动态的构建复杂的谓词](https://fatbobman.com/zh/posts/how-to-dynamically-construct-complex-predicates-for-swiftdata/)

[Swift Predicate: 用法、构成及注意事项](https://fatbobman.com/zh/posts/swift-predicate-usage-composition-and-considerations/)

[如何处理 SwiftData 谓词中的可选值](https://fatbobman.com/zh/posts/how-to-handle-optional-values-in-swiftdata-predicates/)

[GeometryReader ：好东西还是坏东西？](https://fatbobman.com/zh/posts/geometryreader-blessing-or-curse/)

[精通 SwiftUI 的 containerRelativeFrame 修饰器](https://fatbobman.com/zh/posts/mastering-the-containerrelativeframe-modifier-in-swiftui/)

`visualEffect` modifier 了解

`onGeometryChange` modifier 了解

[用 SwiftUI 的方式进行布局](https://fatbobman.com/zh/posts/layout-in-swiftui-way/)

[在 SwiftUI 中实现视图居中的若干种方法](https://fatbobman.com/zh/posts/centering_the_view_in_swiftui/)

`containerRelativeFrame` modifier 了解

[SwiftUI geometryGroup() 指南：从原理到实践](https://fatbobman.com/zh/posts/mastring-geometrygroup/)

[获取 SwiftUI 视图尺寸的多种方法](https://fatbobman.com/zh/snippet/how-to-obtain-view-dimensions-in-swiftui/)

[SwiftData 使用前必须了解的关键问题](https://fatbobman.com/zh/posts/key-considerations-before-using-swiftdata/)

[SwiftData 中的关系：变化与注意事项](https://fatbobman.com/zh/posts/relationships-in-swiftdata-changes-and-considerations/)

[Predicate](https://developer.apple.com/documentation/foundation/predicate?utm_source=Fatbobman%20Blog&utm_medium=web)

[在 SwiftUI 中，根据需求弹出不同的 Sheet](https://fatbobman.com/zh/posts/swiftui-multisheet/)

[Understanding the navigation stack](https://developer.apple.com/documentation/swiftui/understanding-the-composition-of-navigation-stack)

[Creating performant scrollable stacks](https://developer.apple.com/documentation/swiftui/creating-performant-scrollable-stacks)

[Building layouts with stack views](https://developer.apple.com/documentation/swiftui/building-layouts-with-stack-views)

[SwiftUI 中的 UserDefaults 与 Observation：如何实现精准响应](https://fatbobman.com/zh/posts/userdefaults-and-observation/)

[@AppStorage 研究](https://fatbobman.com/zh/posts/appstorage/)

[深度解读 Observation —— SwiftUI 性能提升的新途径](https://fatbobman.com/zh/posts/mastering-observation/)

