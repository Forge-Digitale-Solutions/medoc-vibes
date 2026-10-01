# Médoc data

## `medoc-communes-codes-postaux.csv`

Allowlist of **56 Médoc communes** (columns: `commune`, `code_postal`, `zone`).

### Definition (source of truth)

Union of Médoc EPCI + Portes du Médoc — **no exceptions**:

| Zone | EPCI / status | SIREN | Count |
|---|---|---:|---:|
| Nord Atlantique | CC Médoc Atlantique | `200070720` | 14 |
| Cœur de Presqu'île | CC Médoc Cœur de Presqu'île | `200069995` | 18 |
| Estuaire | CC Médoc Estuaire | `243301447` | 10 |
| Médullienne | CC Médullienne | `243301389` | 10 |
| Portes du Médoc | Bordeaux Métropole (Blanquefort, Parempuyre, Le Taillan-Médoc, Saint-Aubin-de-Médoc) | `243300316` | 4 |

Equivalent: INSEE arrondissement Lesparre-Médoc (`334`, 49 communes) + 7 Médoc communes of Bordeaux arrondissement.

Sources: [geo.api.gouv.fr](https://geo.api.gouv.fr) EPCI membership & postal codes; [BANATIC](https://www.banatic.interieur.gouv.fr); [INSEE COG arr. 334](https://www.insee.fr/fr/metadonnees/geographie/arrondissement/334-lesparre-medoc).

### Postal codes

- One official CP per commune from geo.api.gouv.fr (**16** distinct CPs).
- **Filter by commune name, not postal code alone.** Codes `33160`, `33290`, `33320`, and `33680` also cover neighbouring non-Médoc localities.

### Out of scope

- Eysines (canton / PNR partner only)
- CC de l'Estuaire (Blaye / right bank)
- Geometric triangle/bbox filters are optional API prefilters only — they must not override this allowlist.
