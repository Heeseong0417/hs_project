import {ParentType} from '../schema/SchemaPropertyItem';

export const currentSchemaPosNew = (
  parent: ParentType[],
  tmpSchemaData: any,
  name?: string,
) => {
  let tmpObj = tmpSchemaData['properties'];
  for (let i = 0; i < parent.length; i++) {
    // 자식 프로퍼티가 있는 경우 처리 (오브젝트)
    if (parent[i].type === 'object') {
      if (i == parent.length - 1) {
        tmpObj = tmpObj[parent[i].name];
      } else {
        tmpObj = tmpObj[parent[i].name]['properties'];
      }
      // tmpObj = tmpObj['properties'][parent[i].name];
    } else if (parent[i].type === 'array') {
      // if (Array.isArray(tmpObj)) {
      //   const order = parseInt(name.split('Item ')[1]);
      //   tmpObj = tmpObj['items'][order];
      // } else {
      const checker = parent[i].name.split(' ')[0];
      const order = parent[i].name.split(' ')[1];
      if (checker == 'Item') {
        tmpObj = tmpObj['items'];
        if (Array.isArray(tmpObj)) {
          tmpObj = tmpObj[order];
        } else {
          tmpObj = tmpObj;
        }
      } else {
        tmpObj = tmpObj[parent[i].name];
      }
      // }
    }
  }
  return tmpObj;
};

export const currentSchemaPos = (
  parent: ParentType[],
  tmpSchemaData: any,
  name?: string,
) => {
  let tmpObj = tmpSchemaData['properties'];
  for (let i = 0; i < parent.length; i++) {
    // 자식 프로퍼티가 있는 경우 처리 (오브젝트)
    if (parent[i].type === 'object') {
      if (i == parent.length - 1) {
        tmpObj = tmpObj[parent[i].name];
      } else {
        tmpObj = tmpObj[parent[i].name]['properties'];
      }
      // tmpObj = tmpObj['properties'][parent[i].name];
    } else if (parent[i].type === 'array') {
      // if (Array.isArray(tmpObj)) {
      //   const order = parseInt(name.split('Item ')[1]);
      //   tmpObj = tmpObj['items'][order];
      // } else {
      const checker = parent[i].name.split(' ')[0];
      const order = parent[i].name.split(' ')[1];
      if (checker == 'Item') {
        tmpObj = tmpObj['items'];
        if (Array.isArray(tmpObj)) {
          tmpObj = tmpObj[order];
        } else {
          tmpObj = tmpObj;
        }
      } else {
        tmpObj = tmpObj[parent[i].name];
      }
      // }
    }
  }
  return tmpObj;
};

export const currentSchemaPosDelete = (
  parent: ParentType[],
  tmpSchemaData: any,
  name?: string,
) => {
  let tmpObj = tmpSchemaData['properties'];
  for (let i = 0; i < parent.length; i++) {
    // 자식 프로퍼티가 있는 경우 처리 (오브젝트)
    if (parent[i].type === 'object') {
      // if (i == parent.length - 1) {
      //   tmpObj = tmpObj[parent[i].name];
      // } else {
      //   tmpObj = tmpObj[parent[i].name]['properties'];
      // }
      tmpObj = tmpObj[parent[i].name]['properties'];
    } else if (parent[i].type === 'array') {
      // if (Array.isArray(tmpObj)) {
      //   const order = parseInt(name.split('Item ')[1]);
      //   tmpObj = tmpObj['items'][order];
      // } else {
      const checker = parent[i].name.split(' ')[0];
      const order = parent[i].name.split(' ')[1];
      if (checker == 'Item') {
        tmpObj = tmpObj['items'];
        if (Array.isArray(tmpObj)) {
          tmpObj = tmpObj[order];
        } else {
          tmpObj = tmpObj;
        }
      } else {
        tmpObj = tmpObj[parent[i].name];
      }
      // }
    }
  }
  return tmpObj;
};
