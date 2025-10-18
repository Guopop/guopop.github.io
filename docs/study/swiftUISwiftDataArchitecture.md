# SwiftUI SwiftData 项目架构

# SwiftUI + SwiftData 项目骨架

下面是一个可直接拷贝到 Xcode 的项目骨架示例，包含常见目录与每层 demo 文件模板。

```
Sources/
├─ Models/
│  └─ Book.swift
├─ ViewModels/
│  └─ BookListViewModel.swift
├─ Views/
│  └─ BookListView.swift
├─ Managers/
│  ├─ BookManager.swift
│  └─ SyncManager.swift
├─ Services/
│  ├─ CloudKitService.swift
│  └─ APIService.swift
├─ Utils/
│  └─ Extensions.swift
└─ App.swift
```

---

// MARK: - Models/Book.swift

```swift
import Foundation
import SwiftData

@Model
final class Book {
    var id: String = UUID().uuidString
    var title: String
    var author: String
    var createdAt: Date = .now

    init(title: String, author: String) {
        self.title = title
        self.author = author
    }
}
```

---

// MARK: - ViewModels/BookListViewModel.swift

```swift
import Foundation
import Combine
import SwiftData

/// 使用 @Observable（简化宏风格）作为演示。如果你项目中没有该宏, 请替换为 @MainActor class + ObservableObject
@Observable
final class BookListViewModel {
    @ObservationIgnored private let bookManager: BookManager

    var books: [Book] = []
    var isLoading: Bool = false
    var errorMessage: String? = nil

    init(bookManager: BookManager = .shared) {
        self.bookManager = bookManager
    }

    func loadBooks() {
        isLoading = true
        defer { isLoading = false }
        do {
            books = try bookManager.fetchAll()
        } catch {
            errorMessage = "加载失败：\(error)"
        }
    }

    func addSample() {
        do {
            try bookManager.addBook(title: "示例书籍", author: "作者")
            loadBooks()
        } catch {
            errorMessage = "新增失败：\(error)"
        }
    }
}
```

---

// MARK: - Views/BookListView.swift

```swift
import SwiftUI
import SwiftData

struct BookListView: View {
    @StateObject private var vm = BookListViewModel()

    var body: some View {
        NavigationStack {
            List(vm.books, id: \"id\") { book in
                VStack(alignment: .leading) {
                    Text(book.title).font(.headline)
                    Text(book.author).font(.subheadline)
                }
            }
            .navigationTitle("书库")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { vm.addSample() }) {
                        Image(systemName: "plus")
                    }
                }
            }
            .onAppear { vm.loadBooks() }
            .overlay(
                Group {
                    if vm.isLoading { ProgressView() }
                }
            )
        }
    }
}

struct BookListView_Previews: PreviewProvider {
    static var previews: some View {
        BookListView()
    }
}
```

---

// MARK: - Managers/BookManager.swift

```swift
import Foundation
import SwiftData

@MainActor
final class BookManager {
    static let shared = BookManager()

    private var modelContext: ModelContext

    private init(context: ModelContext = ModelContext()) {
        // 说明: 在真实项目中，你应把 ModelContext 从外部注入（Scene/Environment）
        self.modelContext = context
    }

    func fetchAll() throws -> [Book] {
        try modelContext.fetch(FetchDescriptor<Book>())
    }

    func addBook(title: String, author: String) throws {
        let book = Book(title: title, author: author)
        modelContext.insert(book)
        try modelContext.save()
    }

    func delete(_ book: Book) throws {
        modelContext.delete(book)
        try modelContext.save()
    }
}
```

---

// MARK: - Managers/SyncManager.swift

```swift
import Foundation

/// 负责协调 Manager 与 Services 的同步逻辑
@MainActor
final class SyncManager {
    static let shared = SyncManager()

    private let cloudService = CloudKitService()
    private let bookManager = BookManager.shared

    private init() {}

    func syncToCloud() async throws {
        let books = try bookManager.fetchAll()
        try await cloudService.upload(books: books)
    }

    func pullFromCloud() async throws {
        let booksFromCloud = try await cloudService.fetchAll()
        // 这里添加合并逻辑
        for dto in booksFromCloud {
            try await bookManager.addBook(title: dto.title, author: dto.author)
        }
    }
}
```

---

// MARK: - Services/CloudKitService.swift

```swift
import Foundation

struct BookDTO: Codable {
    let id: String
    let title: String
    let author: String
}

actor CloudKitService {
    init() {}

    func upload(books: [Book]) async throws {
        // 模拟上传
        try await Task.sleep(nanoseconds: 200_000_000)
        // 实际实现：使用 CloudKit APIs 将 Book 映射为 CKRecord 并上传
    }

    func fetchAll() async throws -> [BookDTO] {
        // 模拟拉取
        try await Task.sleep(nanoseconds: 200_000_000)
        return []
    }
}
```

---

// MARK: - Services/APIService.swift

```swift
import Foundation

actor APIService {
    func fetchRemoteBooks() async throws -> [BookDTO] {
        // 使用 URLSession 实现网络请求
        return []
    }
}
```

---

// MARK: - Utils/Extensions.swift

```swift
import Foundation

extension Date {
    func formattedShort() -> String {
        let f = DateFormatter()
        f.dateStyle = .short
        f.timeStyle = .short
        return f.string(from: self)
    }
}
```

---

// MARK: - App.swift

```swift
import SwiftUI
import SwiftData

@main
struct MyBooksApp: App {
    var body: some Scene {
        WindowGroup {
            BookListView()
                // 在真实项目中将 ModelContainer 或 ModelContext 注入到 environment
        }
    }
}
```

---

# 使用说明
- 这是一个最小演示骨架，重点展示：Models、ViewModels、Managers、Services 的划分。
- 在真实应用中，请把 `ModelContext` 或 `ModelContainer` 作为单点注入（Scene 或 App 注入），避免单例隐式依赖。
- `@Observable` 与 `@ObservationIgnored` 是为演示简化写法——如果你使用标准 SwiftUI，请改为 `@MainActor class ViewModel: ObservableObject` 并使用 `@Published`。

如果你需要：
- 把这些文件打包成 Xcode 项目结构（包含 Package/targets）;
- 或者把 `ModelContext` 注入示例改成 SceneDelegate/SwiftUI lifecycle 的注入示例；

告诉我想要的格式（例如：直接将文件写入一个 zip，或者我继续在画布里添加更多文件）。
