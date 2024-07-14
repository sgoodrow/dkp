# Routes

## 🚧 Layout: `/private`

- Navigation header - current user, logout, link to player page, current DKP & lifetime DKP
- Navigation sidebar - nav to: home, players, raids, items, adjustments, leaderboard, admin (admin-only); links to: discord, rules; button for: darkmode toggle

## 🚧 Page: `/private/home`

- Guild banner
- My current DKP - labeled value card => `/private/player/<id>`
- My recent characters - card with table => `/private/player/<id>`
- My recent raids - card with table => `/private/raids?player=<id>`
- My recent items - card with table => `/private/items?player=<id>`
- My recent adjustments - card with table => `/private/adjustments?player=<id>`
- Leaderboard preview - cards with tables => `/private/leaderboard`
- Recent raids - card with table => `/private/raids`
- Recent items - card with table => `/private/items`

## Page: `/private/players`

- Players list - table with filters => `/private/player/<id>`

### Sub-page: `/private/players/<id>`

- Character details - cards => `/private/player/<id>/characters/<id>`
- New character button => `dialog

### Sub-page: `/private/players/<id>/characters/<id>`

- Character details - labeled value cards
- Recent raids - table => `/private/raids/<id>`
- Recent items - table => `/private/items/<id>`
- Recent adjustments - table => `/private/adjustments/<id>`
- (owner | admin) Delete character button => confirm dialog
- (owner | admin) Edit/Save character changes

## Page: `/private/raids`

- Raids list - table with filters (player, raid type, item, DKP awarded) => `/private/raids/<id>`

### Sub-page: `/private/raids/<id>`

- Attendees list - table by class => `/private/player/<id>`
- Items list - table => `/private/items/<id>`
- Adjustments list - table => `/private/adjustments`

## Page: `/private/items`

- Items list - table with filters (by player, DKP cost, raid type) => `/private/items/<id>`

### Sub-page: `/private/items/<id>`

- Item stats - card / embed
- Item history - chart of cost over time

## Page: `/private/adjustments`

- Add adjustment button
- Adjustments list - table with filters (by player, category) => `/private/adjustments/<id>`
- Edit/save adjustment button - confirm dialog
- Delete adjustment button - confirm dialog

## Page: `/private/leaderboard`

- DKP totals list - table with filters (by class)

## Page `/private/admin`

- Links to admin pages: raid-types, permissions, unassigned characters, api keys

### Sub-page `/private/admin/raid-types`

- Add raid type => dialog
- Raid types list - table
- Edit/Save raid type => dialog

### Sub-page `/private/admin/permissions`

- List of owners
- Add/remove owner
- List of admins
- Add/remove admin

### Sub-page `/private/admin/unassigned-characters`

- Characters list - table with filters (by class, level, dkp)
- Assign character button => dialog => confirm dialog

### Sub-page `/private/admin/api-keys`

- List of all current API keys
- Button to create API key
- Button to revoke API key
