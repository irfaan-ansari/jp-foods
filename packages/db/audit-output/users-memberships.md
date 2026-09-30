# User and membership audit

- Read-only database snapshot; no records were modified.
- JSON has no organization/team mappings. Missing specific historical memberships cannot be proved without those exports.
- Email/phone matches are candidates, not proof of identity. No automatic merge or creation is performed.
- No-membership lists cover current users resolved from the JSON; missing users are listed separately. Staff may legitimately have no team.
- Parent-membership check covers all current database team members.

## Missing users (no ID, email or phone match) (2)

ID | Name | Email | Phone | Role
--- | --- | --- | --- | ---
QTCG1FniPOn2qquDJKivEizlsjl99cZM | John | email@email.com | 0987654321 | customer
avWPo65ei5DPPZpVEdHPbIvDFlohlppz | Acme | customer2@gmail.com | 0987654321 | customer

## Users without any organization membership (0)

None.

## Users without any team membership (15)

ID | Name | Email | Phone | Role
--- | --- | --- | --- | ---
1jjtbC9Wq4ti7SzlCmITASeu5qaDlMEz | sue rodriguez | pedrosjuban@gmail.com | +12256121165 | customer
5A598A2rtRbimRMEXs5HXzjcOJFxzEcn | Joe | joe@jimenezproduce.com | +19418404440 | admin
Bm8EZBwGT4lwllU71SR8K4s5NMQ4K8Al | Corey | info@jimenezproduce.net | +17703356619 | admin
CrNARh8QOJQZvv59Z0FsQoLYU6NvEiez | Andres Barba | andres@jimenezproduce.com | +12512135269 | admin
FscBXhX3D58n6ufKj3WKTNpj999s2hY6 | Maritza Weeks | elpasomexfoley@gmail.com | +12519238117 | customer
GLhDlBmsDMZGWyYV7R6B2essTM7oLG1K | Jackie | jackie@jimenezproduce.com | +12515975986 | admin
JPT6v3YWmZ4NRa3NFXzqrggzerwYkNHe | Elizabeth | elizabeth@jimenezproduce.com | +12512409687 | admin
K9xUhWqVoozvyrEgnsPNWoB4Wdw5VT8U | Luisa Blanco | luisa@jimenezproduce.com | +18136828728 | admin
Sw4w5kwDuhJUbXz8V5Q9YWTqAYmCZzWD | Yhessenia | yhessenia@jimenezproduce.com | +17866585857 | admin
XVYjD4qIpfxPkh72jTNUd9koiClhdZK7 | Jorge | jorge@jimenezproduce.com | +19392521474 | admin
cgW2FKbwi2IHVWJNVmo2uXAVDOcH9Hxn | Kenned Hernandez | needemail@demaizms.com | +12516441483 | customer
el9LqrpDMekeE7RymDsQ4eOFQPAnX0KB | valentin cruz | cruzsegundo1927@gmail.com | +13372504102 | customer
hJh9fLV65CyGk533NcyaPTu9nRXjpm8I | Francisco Vargas | francisco@jimenezproduce.com | +17866585785 | admin
vVprh4Kf2s4ODzMx2xDtXIJTD2ZP5j8N | Daniel Mendoza | needemaildaniel@gautier.com | +12513829149 | customer
yFV274s2Wkjfu0fTodtsTT8agon3RYOX | Jessica Trejo | jtrejo@innovategr.com | +12282810824 | customer

## Team members missing their parent organization membership (0)

None.

## Possible missing team memberships — verify contact matches (11)

Source ID | Current user ID | Name | Team | Team ID | Evidence
--- | --- | --- | --- | --- | ---
Bm8EZBwGT4lwllU71SR8K4s5NMQ4K8Al | Bm8EZBwGT4lwllU71SR8K4s5NMQ4K8Al | Corey | JP Tex Mex - Lafayette | 6emAqU3tQ0inoc9t2EaD222MdmXM6LHb | phone
Bm8EZBwGT4lwllU71SR8K4s5NMQ4K8Al | Bm8EZBwGT4lwllU71SR8K4s5NMQ4K8Al | Corey | Pedros (Arkansas) | sQ4qlTi6yoNzL9RcOPwKDRpn1eIBkiR4 | email
F6niKWOH5r8gly5oT5dfeoBDHXe4mHXA | F6niKWOH5r8gly5oT5dfeoBDHXe4mHXA | Irfan Ansari | Test accountttt | TglUxCm12sxl9vR0Uv9zQy6Q6gKbkTYZ | phone
F6niKWOH5r8gly5oT5dfeoBDHXe4mHXA | F6niKWOH5r8gly5oT5dfeoBDHXe4mHXA | Irfan Ansari | Test account lafayette | FzUopJ5ww1vS7vP7jFk86cnWHu3TTlFI | phone
GRlbVWi6SUkdZBurCmBPa3Fqk9w7vFKT | GRlbVWi6SUkdZBurCmBPa3Fqk9w7vFKT | Corey | Pedros (Tampa) | oU3xGklI0UOwXpJsHhtW9BQiAWRnzB6b | phone
noyQp0vrEC3dGooYy2p25WhSZYZyHL8H | noyQp0vrEC3dGooYy2p25WhSZYZyHL8H | Test Customer | Test Customer | 0GZmNfzwPKIT76Rnw08rP9YYVhjwNGa1 | email
noyQp0vrEC3dGooYy2p25WhSZYZyHL8H | noyQp0vrEC3dGooYy2p25WhSZYZyHL8H | Test Customer | Test accountttt | TglUxCm12sxl9vR0Uv9zQy6Q6gKbkTYZ | phone
noyQp0vrEC3dGooYy2p25WhSZYZyHL8H | noyQp0vrEC3dGooYy2p25WhSZYZyHL8H | Test Customer | Test account lafayette | FzUopJ5ww1vS7vP7jFk86cnWHu3TTlFI | phone
rA6gKTfWedSa8hgA7GZ4Rqh7lfYDN06x | rA6gKTfWedSa8hgA7GZ4Rqh7lfYDN06x | Pedros (Tampa) | Pedros (Arkansas) | sQ4qlTi6yoNzL9RcOPwKDRpn1eIBkiR4 | phone
u7R1tcrY3HtXRoKe2c36ZuZgeyYGFiHf | u7R1tcrY3HtXRoKe2c36ZuZgeyYGFiHf | Bulmaro Gonzalez | Hacienda Real - Breaux Bridge | Ja6fXYo4SM7Ue2UhWojB9UeyhT4WgoHT | phone
ya2x29P44VqFJ0qpQ6okxPKTgyVPpECE | ya2x29P44VqFJ0qpQ6okxPKTgyVPpECE | Luis Ortiz | El Patron - Pensacola, FL | iC5sQ4psD6B3D5oqhXms2zplB3Gzht3u | email

## Duplicate groups: sourceIds (0)

None.

## Duplicate groups: sourceEmails (0)

None.

## Duplicate groups: sourcePhones (7)

### 8888888888

ID | Name | Email | Phone | Role
--- | --- | --- | --- | ---
2nzfGbfeQ3UUjCcTAIu38GADLi1gFWt7 | Pedros (Tampa) | pedros@jimenezproduce.com | 8888888888 | admin
Gw2cgOJCSCv4knEaeL6IycnSib85FDr0 | Jose Jose | test@test.com | 8888888888 | customer

### 8504852894

ID | Name | Email | Phone | Role
--- | --- | --- | --- | ---
Cf07et1xHNt5d2e6dd7hKYHAytFyPDtC | Robledo | cynthia@jimenezproduce.com | 8504852894 | admin
e4w1mB6R2CIMtb6z0i5LxCaiuOUBFoOR | Cynthia | leonidestorres87@gmail.com | 8504852894 | admin

### 9958367688

ID | Name | Email | Phone | Role
--- | --- | --- | --- | ---
F6niKWOH5r8gly5oT5dfeoBDHXe4mHXA | Irfan Ansari | idevirfan@gmail.com | 9958367688 | admin
noyQp0vrEC3dGooYy2p25WhSZYZyHL8H | Test Customer | customer@gmail.com | 9958367688 | customer

### 2512622607

ID | Name | Email | Phone | Role
--- | --- | --- | --- | ---
GRlbVWi6SUkdZBurCmBPa3Fqk9w7vFKT | Corey | info@jimenezproduce.com | 2512622607 | customer
rA6gKTfWedSa8hgA7GZ4Rqh7lfYDN06x | Pedros (Tampa) | pedros@jimenezproduce.net | 2512622607 | customer

### 2517272624

ID | Name | Email | Phone | Role
--- | --- | --- | --- | ---
P4SPJtFAfNaNYvOdxL0X1GPpPd1QDQoE | Victor Fernandez | streettacoselpelon@gmail.com | 2517272624 | customer
mGzCptLnTjgS639WW8JCmX9yqs1ZbMZO | Víctor Fernández | karlamichel5406@gmail.com | 2517272624 | customer

### 0987654321

ID | Name | Email | Phone | Role
--- | --- | --- | --- | ---
QTCG1FniPOn2qquDJKivEizlsjl99cZM | John | email@email.com | 0987654321 | customer
avWPo65ei5DPPZpVEdHPbIvDFlohlppz | Acme | customer2@gmail.com | 0987654321 | customer

### 3187301925

ID | Name | Email | Phone | Role
--- | --- | --- | --- | ---
YtINr04KQ3M5In81BGYmyCwdm30CP2FE | Honorio Zepeda | honoriozepeda@gmail.com | 3187301925 | customer
zUoRFR55d7chmp5c0uIwbUq0ffyonVdO | jesus perez | jj.perez2114@gmail.com | 3187301925 | customer

## Duplicate groups: databaseEmails (0)

None.

## Duplicate groups: databasePhones (1)

### 3187301925

ID | Name | Email | Phone | Role
--- | --- | --- | --- | ---
zUoRFR55d7chmp5c0uIwbUq0ffyonVdO | jesus perez | jj.perez2114@gmail.com | +13187301925 | customer
YtINr04KQ3M5In81BGYmyCwdm30CP2FE | Honorio Zepeda | honoriozepeda@gmail.com | +13187301925 | customer

## Source users matched under another ID (3)

Source: Benjamin Chavez  (UjvJN5kLvnHLIm5sXOg421BDhZTvGlZZ)

ID | Name | Email | Phone | Role
--- | --- | --- | --- | ---
dv6bG9CpXDxyCoV6aum087YHx4ZOiTNc | Benjamin Chavez  | benjamin.chavez098@gmail.com | 3184735735 | admin

Source: Cynthia (e4w1mB6R2CIMtb6z0i5LxCaiuOUBFoOR)

ID | Name | Email | Phone | Role
--- | --- | --- | --- | ---
Cf07et1xHNt5d2e6dd7hKYHAytFyPDtC | Robledo | cynthia@jimenezproduce.com | +18504852894 | customer

Source: Víctor Fernández (mGzCptLnTjgS639WW8JCmX9yqs1ZbMZO)

ID | Name | Email | Phone | Role
--- | --- | --- | --- | ---
P4SPJtFAfNaNYvOdxL0X1GPpPd1QDQoE | Victor Fernandez | streettacoselpelon@gmail.com | +12517272624 | customer

## Ambiguous identity matches (5)

See the JSON report for candidate IDs and membership details.

## Memberships for users sharing a normalized phone

Shared phones do not prove these accounts should be merged.

### 3187301925

User ID | Name | Organizations | Teams
--- | --- | --- | ---
zUoRFR55d7chmp5c0uIwbUq0ffyonVdO | jesus perez | Lafayette (customer) | Lagunas Mex Grill - Lake Charles
YtINr04KQ3M5In81BGYmyCwdm30CP2FE | Honorio Zepeda | Lafayette (customer) | Lagunas Mex Grill - Lake Charles

