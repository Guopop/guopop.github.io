# SwiftData 集成 iCloud

[Syncing model data across a person’s devices](https://developer.apple.com/documentation/swiftdata/syncing-model-data-across-a-persons-devices)

[🔋 修复 Core Data/SwiftData 上架后的云同步问题](https://fatbobman.com/zh/snippet/why-core-data-or-swiftdata-cloud-sync-stops-working-after-app-store-login/)

[🔥 数据模型适配 CloudKit 的规则与注意事项](https://fatbobman.com/zh/snippet/rules-for-adapting-data-models-to-cloudkit/)

[SwiftData: Synchronize Model Data with iCloud (Automatic With ModelContainer)](https://levelup.gitconnected.com/swiftdata-synchronize-model-data-with-icloud-automatic-with-modelcontainer-e37bce84024c)

> 在启用 CloudKit 能力之后，SwiftData 会自动同步数据到 CloudKit `私有数据库`
> 
> SwiftData 只会同步到 `私有数据库`

## iCloud 三种不同的数据存储方式

- Key-value storage
- iCloud Document
- CloudKit

选哪一种方式，可以问AI

其中 CloudKit 还有三种数据库类型

- 私有数据库
- 共享数据库
- 公共数据库

## 配置 Cloudkit 容器

> CloudKit 容器只能创建，不能删除
> 
> CloudKit 有开发环境和生产环境的区分
> 
> 开发环境可以重置，生产环境必须手动删除
> 
> 开发环境，数据模型自动同步，生产环境需要手动将数据模型同步

配置步骤

1. 项目结构 -> Targets `Scroll` -> Signing & Capabilities
2. 添加 `iCloud` Capability
3. 选择 `CloudKit` Services
4. 创建或选择一个 Container ，命名标准 `iCloud.` + Bundle Identifier
5. 添加 `Background Modes` Capability
6. 选择 `Remote notifications`

## SwiftData 数据模型

> CloudKit 对数据模型有特殊要求
> 
> CloudKit 生产环境，数据模型`仅可增加`，`不可删除 types` 或 `不可修改 attributes`
> 
> 所以一开始对数据模型必须考虑周全，遵循“只增，不删不改”原则

- 属性必须为`optional`或`有默认值`
- 不能添加 `@Attribute(.unique)` macro
- `@Relationship` 必须设置成 `optional`
- `@Relationship` 必须设置 `inverse`
- `@Relationship` 删除规则(`deleteRule`)不允许设置成 `deny`

## 查看同步到 CloudKit 的数据

1. 登录 CloudKit Console (可在配置页面快速跳转)
2. 登录指定 iCloud Account (页面上 `Act As iCloud Account`)
3. 配置查询属性的 Queryable 索引 (Schema -> Indexes -> 加号 -> Type, Name, QUERYABLE, recordName)
4. 查询 Data -> Records -> 选择 Private Database -> 选择相应的 Zone -> Query Records

