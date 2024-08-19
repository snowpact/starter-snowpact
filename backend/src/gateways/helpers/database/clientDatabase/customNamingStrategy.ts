/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'crypto';

import { NamingStrategyInterface, DefaultNamingStrategy, Table } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  tableName(targetName: string, userSpecifiedName: string): string {
    return userSpecifiedName ? userSpecifiedName : snakeCase(targetName);
  }

  columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    return snakeCase(embeddedPrefixes.concat(customName ? customName : propertyName).join('_'));
  }

  columnNameCustomized(customName: string): string {
    return customName;
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(`${relationName}_${referencedColumnName}`);
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    secondPropertyName: string,
  ): string {
    return snakeCase(
      `${firstTableName}_${firstPropertyName.replace(/\./gi, '_')}_${secondTableName}`,
    );
  }

  joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string {
    return snakeCase(`${tableName}_ ${columnName ? columnName : propertyName}`);
  }

  classTableInheritanceParentColumnName(
    parentTableName: string,
    parentTableIdPropertyName: string,
  ): string {
    return snakeCase(`${parentTableName}_${parentTableIdPropertyName}`);
  }

  foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    _referencedTablePath?: string,
    _referencedColumnNames?: string[],
  ): string {
    const targetTableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    const fkName = `fk__${targetTableName}-${columnNames.join('_')}__${_referencedTablePath}-${_referencedColumnNames?.join('_')}`;
    return `${fkName}__${this.generateShortHash(fkName)}`;
  }

  uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
    const targetTableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    const uqName = `uq__${targetTableName}-${columnNames.join('_')}`;
    return `${uqName}__${this.generateShortHash(uqName)}`;
  }

  indexName(tableOrName: Table | string, columnNames: string[]): string {
    const targetTableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    const idxName = `idx__${targetTableName}-${columnNames.join('_')}`;
    return `${idxName}__${this.generateShortHash(idxName)}`;
  }

  primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    const targetTableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    const pkName = `pk__${targetTableName}-${columnNames.join('_')}`;
    return `${pkName}__${this.generateShortHash(pkName)}`;
  }

  private generateShortHash(input: string): string {
    const hash: string = crypto.createHash('md5').update(input).digest('hex');
    return hash.slice(0, 8);
  }
}
