const namespace = 'halo__'

const _global = typeof window !== 'undefined' ? window : global || {}

/**
 * Set item to localStorage
 *
 * @param {*} name name
 * @param {*} value value
 * @param {*} expire expire
 */
export function setLocalStorage(name, value, expire = null) {
  const stringifyValue = JSON.stringify({
    value,
    expire: expire !== null ? new Date().getTime() + expire : null
  })

  _global.localStorage.setItem(namespace + name, stringifyValue)
}

/**
 * Get item from localStorage
 *
 * @param {*} name
 * @param {*} emptyValue
 */
export function getLocalStorage(name, emptyValue = null) {
  const item = _global.localStorage.getItem(namespace + name)
  if (item !== null) {
    try {
      const data = JSON.parse(item)

      if (data.expire === null) {
        return data.value
      }

      if (data.expire >= new Date().getTime()) {
        return data.value
      }

      removeLocalStorage(name)
    } catch (err) {
      return emptyValue
    }
  }

  return emptyValue
}

/**
 * Remove item
 *
 * @param {*} name name
 */
export function removeLocalStorage(name) {
  _global.localStorage.removeItem(namespace + name)
}
