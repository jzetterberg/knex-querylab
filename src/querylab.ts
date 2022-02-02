import Knex from "knex";

export enum Dialect {
  mssql = "mssql",
  mysql = "mysql",
  mysql2 = "mysql2",
  //oracle = "oracle",
  oracledb = "oracledb",
  postgres = "postgres",
  redshift = "redshift",
  sqlite3 = "sqlite3",
}

// annoying
export function allDialects() {
  var dialects = [];
  for (const d in Dialect) {
    dialects.push(d);
  }
  return dialects;
}

export function translate(
  knexjs: string,
  dialect: string
): [string, string, any[]] {
  // eslint-disable-next-line
  const knex = Knex({ client: dialect });
  try {
    // eslint-disable-next-line
    const parsed = eval(knexjs);
    const query = `${parsed.toQuery()};`;
    if (dialect === Dialect.mssql) {
      return [query, "", []];
    }
    const native = parsed.toSQL().toNative();
    const nativeQuery = `${native.sql};`;
    return [query, nativeQuery, native.bindings || []];
  } catch (error) {
    console.error(error);
    return ["syntax error", "", []];
  }
}
