# Scroll 重构

## swiftData 配置

直接使用导入 SwiftData 即可

## swiftTesting 配置

点击根目录`Scroll2` -> 创建target -> 选择`Unit Testing Bundle` -> 点击`Scroll2Tests` -> 添加`@testable import Scroll2`

## cloudkit 配置

配置步骤

项目结构 -> Targets`Scroll2` -> Signing & Capabilities
添加 `iCloud` Capability
选择 `CloudKit` Services
创建或选择一个 Container ，命名标准 iCloud. + Bundle Identifier
添加 `Background Modes` Capability
选择 `Remote notifications`



