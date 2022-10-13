import { isSameVnode } from "./index";
export function createElm(vnode) {
  let { tag, data, children, text } = vnode;
  if (typeof tag == "string") {
    // 将真实节点和虚拟节点进行对应，为后续diff算法做准备
    vnode.el = document.createElement(tag);
    patchProps(vnode.el, {}, data);
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}
export function patchProps(el, oldProps, props) {
  // 老的属性中有，新的没有，要删除老的
  let oldStyles = oldProps.style;
  let newStyle = props.style;
  // 对于style
  for (let key in oldProps) {
    if (!newStyle[key]) {
      el.style[key] = "";
    }
  }
  // 对于一般属性
  for (let key in oldProps) {
    if (!props[key]) {
      el.removeAttribute(key);
    }
  }
  // 用新的覆盖掉老的
  for (let key in props) {
    if (key == "style") {
      for (let styleName in props.style) {
        el.style[styleName] = props.style[styleName];
      }
    } else {
      el.setAttribute(key, props[key]);
    }
  }
}
export function patch(oldVNode, vnode) {
  const isRealElement = oldVNode.nodeType;
  if (isRealElement) {
    // 获取真实元素
    const elm = oldVNode;
    // 拿到父元素
    const parentElm = elm.parentNode;
    let newElm = createElm(vnode);
    parentElm.insertBefore(newElm, elm.nextSibiling);
    parentElm.removeChild(elm);
    return newElm;
  } else {
    // diff算法
    return patchVnode(oldVNode, vnode);
  }
}

function patchVnode(oldVNode, vnode) {
  // 两个节点不是同一个节点，直接删除老的，换上新的（没有对比）

  // 两个节点是同一个节点，判断节点的tag和key，tag和key一样是同一个节点，此时去比较两个节点的属性是否有差异（复用老的节点，将差异的属性更新）
  // 节点比较完成后，比较两个节点的子节点
  // 如果不是同一节点，用新节点替换老节点
  if (!isSameVnode(oldVNode, vnode)) {
    // 用老节点的父亲进行替换
    //这里的el属性就是虚拟节点对应的真实节点
    let el = createElm(vnode);
    oldVNode.el.parentNode.replaceChild(el, oldVNode);
    return el;
  }
  // 如果是文本节点，就比对一下文本的内容
  let el = (vnode.el = oldVNode.el); //复用老节点的元素
  if (!oldVNode.tag) {
    // 文本的情况
    if (oldVNode.text !== vnode.text) {
      el.textContent = vnode.text;
    }
  }
  //是标签，需要比对标签的属性
  patchProps(el, oldVNode.data, vnode.data);
  // 比较子节点：
  // 1.一方有儿子，一方没儿子
  // 2.两方都有儿子
  let oldChildren = oldVNode.children || [];
  let newChildren = vnode.children || [];
  if (oldChildren.length > 0 && newChildren.length > 0) {
    // 完整的diff算法
    updateChild(el, oldChildren, newChildren);
  } else if (newChildren > 0) {
    // 老的没有新的有
    mountChildren(el, newChildren);
  } else if (oldChildren > 0) {
    // 新的没有老的有
    unmountChild(el, oldChildren);
  }
  return el;
}

function mountChildren(el, children) {
  for (let i = 0; i < children.length; i++) {
    let child = newChildren[i];
    el.appendChild(createElm(child));
  }
}

function unmountChild(el, children) {
  el.innerHTML = "";
}

function updateChild(el, oldChildren, newChildren) {
  // 为了增高性能，会有一些优化手段
  // vue2中采用双指针的方式比较两个节点
  let oldStartIndex = 0;
  let newStartIndex = 0;
  let oldEndIndex = oldChildren.length - 1;
  let newEndIndex = newChildren.length - 1;

  let oldStartVnode = oldChildren[0];
  let newStartVnode = newChildren[0];

  let oldEndVnode = oldChildren[oldEndIndex];
  let newEndVnode = newChildren[newEndIndex];
  console.log(oldStartVnode, newStartVnode, oldEndVnode, newEndVnode);
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 有一方的头指针大于尾部指针，则停止循环
  }
}
