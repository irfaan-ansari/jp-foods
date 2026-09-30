# Export linkage audit

Read-only comparison with the current database. Links are compared by user + organization/team, not membership record ID. Same-email alternate accounts are reported separately and are not automatically treated as the same user.

```json
{
  "sourceCounts": {
    "users": 221,
    "members": 304,
    "teamMembers": 229,
    "orders": 2247,
    "teams": 312
  },
  "organizationLinksPresent": 303,
  "organizationLinksMissing": 1,
  "organizationRoleDifferences": 0,
  "teamLinksPresent": 228,
  "teamLinksMissing": 1,
  "missingTeams": 0,
  "changedTeamOrganizations": 0,
  "ordersWithSameLinks": 2226,
  "missingOrders": 1,
  "changedOrderLinks": 20,
  "orderMissingReferences": 9,
  "orderMembershipGaps": 9,
  "parentOrganizationGaps": 0
}
```

## Missing exported organization links

User ID | Name | Organization | Organization ID | User exists
--- | --- | --- | --- | ---
UjvJN5kLvnHLIm5sXOg421BDhZTvGlZZ | Benjamin Chavez  | Lafayette | knDzquD2nM46AF1WPpKY1EmJZrOOzM2M | false

## Missing exported team links

User ID | Name | Team | Team ID | User exists
--- | --- | --- | --- | ---
UjvJN5kLvnHLIm5sXOg421BDhZTvGlZZ | Benjamin Chavez  | Pedro's - Alexandria | tR8tirhDFkWFmIyKQ225qUBxPHYqzFjM | false

## Organization role differences

None.

## Current team members missing parent organization links

None.

## Users with no current team: historical evidence

Name | User ID | Role | Exported team memberships | Exported orders
--- | --- | --- | --- | ---
sue rodriguez | 1jjtbC9Wq4ti7SzlCmITASeu5qaDlMEz | customer | 0 | 0
Joe | 5A598A2rtRbimRMEXs5HXzjcOJFxzEcn | admin | 0 | 0
Corey | Bm8EZBwGT4lwllU71SR8K4s5NMQ4K8Al | admin | 0 | 0
Andres Barba | CrNARh8QOJQZvv59Z0FsQoLYU6NvEiez | admin | 0 | 0
Maritza Weeks | FscBXhX3D58n6ufKj3WKTNpj999s2hY6 | customer | 0 | 0
Jackie | GLhDlBmsDMZGWyYV7R6B2essTM7oLG1K | admin | 0 | 0
Elizabeth | JPT6v3YWmZ4NRa3NFXzqrggzerwYkNHe | admin | 0 | 0
Luisa Blanco | K9xUhWqVoozvyrEgnsPNWoB4Wdw5VT8U | admin | 0 | 0
Yhessenia | Sw4w5kwDuhJUbXz8V5Q9YWTqAYmCZzWD | admin | 0 | 0
Jorge | XVYjD4qIpfxPkh72jTNUd9koiClhdZK7 | admin | 0 | 0
Kenned Hernandez | cgW2FKbwi2IHVWJNVmo2uXAVDOcH9Hxn | customer | 0 | 0
Cynthia | e4w1mB6R2CIMtb6z0i5LxCaiuOUBFoOR | admin | 0 | 0
valentin cruz | el9LqrpDMekeE7RymDsQ4eOFQPAnX0KB | customer | 0 | 0
Francisco Vargas | hJh9fLV65CyGk533NcyaPTu9nRXjpm8I | admin | 0 | 0
Víctor Fernández | mGzCptLnTjgS639WW8JCmX9yqs1ZbMZO | customer | 0 | 0
Daniel Mendoza | vVprh4Kf2s4ODzMx2xDtXIJTD2ZP5j8N | customer | 0 | 0
Jessica Trejo | yFV274s2Wkjfu0fTodtsTT8agon3RYOX | customer | 0 | 0

## Missing orders

Order ID | User | User ID | Team ID
--- | --- | --- | ---
2478 | Luis Salas | sk109vRH9eQzUXqlz25J41z1jZXvp4ZG | UwgW58d83QWC851ViCWaB4oGY761eo5h

## Order membership gaps

An order's user link records who placed it; staff can place orders without customer team membership. These gaps alone do not prove a lost membership.

User | User ID | Role | Team | Organization linked | Team linked | Orders
--- | --- | --- | --- | --- | --- | ---
Unknown user | Ttcz7A16ql1WbOCo4fZJTyJ5MjS9lDrE |  | Hacienda San Miguel - Schillinger | false | false | 226, 236, 244, 265, 280, 287, 288
Unknown user | trrQGHyd63KudLXhBmW5Xkd4HJqslng3 |  | Aztecas - Saraland | false | false | 279, 323

Full source/current linkage details, alternate-user matches and changed orders are in the JSON report.
