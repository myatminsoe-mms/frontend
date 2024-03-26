import ability from './ability'

export const canNavigate = (to) => {
  if (to.meta.subject) {
    ability.can(to.meta.action, to.meta.subject)
  }
  return true
}

export const _ = undefined
