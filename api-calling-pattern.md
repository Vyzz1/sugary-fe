# API Calling Pattern — personal-expense-fe

Tài liệu ngắn mô tả pattern gọi API dùng trong project này (React + TanStack Query + Axios wrapper).

## Mục tiêu

- Tập trung logic gọi API (endpoints, query keys, options) vào các `-queries` và `-hooks` để dễ maintain.
- Giữ cache/chia sẻ dữ liệu bằng React Query, tránh gọi API trùng lặp ở nhiều component.
- Chuẩn hóa naming convention cho query key, hook và mutation.

## Tổng quan convention

- Query keys: export object `*Keys` chứa `all` và helper builders.
  - Ví dụ: `categoryKeys.all = ["categories"]`
- Query options: export `*QueryOptions` (staleTime, refetchOnWindowFocus, ...)
- Base URL constants: export trong hook/queries nếu cần, ví dụ `BASE_CATEGORY_URL = "/categories"`.
- Hooks:
  - Query hooks: `useSomethingQuery` (hoặc `useXxxListQuery`) => dùng `useApiQuery(queryKey, url, options)`
  - Mutation hooks: `useSaveXxxMutation(options)` => dùng `useApiMutation(urlOrFn, method, options)`
- Invalidation: mutation dùng `useQueryClient().invalidateQueries({ queryKey: <keys>.all })` sau khi thay đổi dữ liệu.

## File structure (pattern)

- `routes/<feature>/-queries/<feature>.query.ts` → export keys + query options
- `routes/<feature>/-hooks/use<Feature>Query.ts` → export query hooks (read)
- `routes/<feature>/-hooks/useSave<Feature>Mutation.ts` → export save mutation (create/update)
- Components chỉ import hooks và types, không gọi API trực tiếp.

### Folder structure for `routes`

Đề xuất cấu trúc cho mỗi route feature (giữ consistency, dễ tìm và refactor):

```
src/routes/_auth/<feature>/
  index.tsx                # route file (createFileRoute) — only routing + composition
  -components/             # UI components specific cho route
    <component>.tsx
  -hooks/                  # local hooks cho feature (queries/mutations)
    use<Feature>Query.ts
    useSave<Feature>Mutation.ts
  -queries/                # query keys và option object
    <feature>.query.ts
  -schemas/                # zod schemas cho search / body / params
    <feature>-search.ts
  -constants/              # hằng số riêng feature
    index.ts
```

Ví dụ (transaction):

- `src/routes/_auth/transaction/-queries/transaction.query.ts` — định nghĩa `transactionKeys`
- `src/routes/_auth/transaction/-hooks/useTransactionsQuery.ts` — `useTransactionListQuery`
- `src/routes/_auth/transaction/-hooks/useSaveTransactionMutation.ts` — save mutation
- `src/routes/_auth/transaction/index.tsx` — route composition, gọi `useTransactionListQuery` và render các `-components`

Ghi chú:

- `index.tsx` nên chỉ làm nhiệm vụ route composition (validateSearch, useSearch, render components). Không nên chứa logic fetch phức tạp.
- Đặt mapping params → axios params trong `-hooks` (ví dụ `toTransactionListApiParams`) để dễ test và tái sử dụng.
- Nếu phần logic dùng chung giữa nhiều route (ví dụ helpers), tạo `src/routes/_auth/shared/` hoặc `src/lib/`.

## Example: Categories

- Query keys: [src/routes/\_auth/category/-queries/category.query.ts](src/routes/_auth/category/-queries/category.query.ts)
- Shared query hook: `useCategoriesQuery` in [src/routes/\_auth/category/-hooks/useCategoriesQuery.ts](src/routes/_auth/category/-hooks/useCategoriesQuery.ts)
- Save mutation hook: `useSaveCategoryMutation` in [src/routes/\_auth/category/-hooks/useSaveCategoryMutation.ts](src/routes/_auth/category/-hooks/useSaveCategoryMutation.ts)

Sample usage in component:

```tsx
// component.tsx
const { data: categories, isLoading } = useCategoriesQuery();

// modal form uses
const { saveCategory, isPending } = useSaveCategoryMutation({ categoryId });
await saveCategory(values);
// mutation will invalidate categoryKeys.all automatically
```

## Example: Transactions (list + save)

- Query keys: [src/routes/\_auth/transaction/-queries/transaction.query.ts](src/routes/_auth/transaction/-queries/transaction.query.ts)
- Query hook: `useTransactionListQuery(params)` in [src/routes/\_auth/transaction/-hooks/useTransactionsQuery.ts](src/routes/_auth/transaction/-hooks/useTransactionsQuery.ts)
- Save mutation: `useSaveTransactionMutation` in [src/routes/\_auth/transaction/-hooks/useSaveTransactionMutation.ts](src/routes/_auth/transaction/-hooks/useSaveTransactionMutation.ts)

Notes:

- Map search params to API params in a small helper function `toTransactionListApiParams(params)` inside the hook file.
- Pass the parsed params via `axiosConfig.params`.

## Invalidation patterns

- Mutations should invalidate a narrow key that covers viewers of the changed resource.
  - Example: after saving a category, invalidate `categoryKeys.all`.
  - After saving a transaction, invalidate `transactionKeys.all` (or more narrow keys if needed).
- Prefer `queryClient.invalidateQueries({ queryKey: someKey })` over manual `refetch()` from multiple places.

## When to use Context vs shared hooks

- Use shared query hooks + React Query cache when data comes from server and should be cached/shared.
  - Pros: deduped requests, centralized cache, easy invalidation.
- Use React Context when you need to share local UI state or cross-cutting ephemeral state (e.g., currently selected category across deeply nested components), not for server data caching.

## Naming conventions

- Query keys: `featureKeys` with `.all`, `.lists()`, `.list(params)` helpers.
- Query hook: `use<Feature>Query` or `use<Feature>ListQuery`.
- Mutation hook: `useSave<Feature>Mutation` (supports create/update via optional id param).

## Small checklist before adding a new feature

- [ ] Add `<feature>.query.ts` with keys and options
- [ ] Add query hook(s) in `-hooks` implementing param -> axios params mapping
- [ ] Add mutation hook(s) for save/delete that invalidate correct keys
- [ ] Update components to consume hooks only
- [ ] Run TypeScript checks and ensure no unused imports
