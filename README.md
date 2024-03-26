# Event Ticketing Admin Portal

Vue3 Modular Architecture.

## Project setup

### Edit .env

```
VITE_ENV=local
VITE_ROOT_API=
VITE_I18N_FALLBACK_LOCALE=en
```

```
npm install
npx husky install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Formats files

```
npm run format
```

## Features

[Vue3](https://vuejs.org/)<br>
[Vue Composition API](https://vuejs.org/api/composition-api-setup.html)<br>
[Vue Router](https://router.vuejs.org/) - The official router for Vue.js<br>
[Pinia](https://pinia.vuejs.org/) - The Vue Store that you will enjoy using<br>
[Axios](https://axios-http.com/) - Promise based HTTP client for the browser and node.js<br>
[I18ns](https://vue-i18n.intlify.dev/) - Vue I18n is internationalization plugin for Vue.js<br>
[CASL](https://casl.js.org/v6/en/) - Isomorphic Authorization JavaScript library<br>
[Husky](https://typicode.github.io/husky/) - Modern native git hooks made easy<br>
[Vite](https://vitejs.dev/) - Next Generation Frontend Tooling<br>

## UI

[PrimeVue](http://www.primefaces.org/primevue/) with [Sakai Admin Template](https://github.com/primefaces/sakai-vue)
<br>

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [Editor Config](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

## Recommended Node Version

Node >= 16
<br>

## Learning Resources

[Cheatsheets](https://www.vuemastery.com/vue-cheat-sheet)<br>
[PrimeFlex](https://www.primefaces.org/primeflex/)<br>
[VueUse](https://vueuse.org/)<br>
[Vue Community](https://vue-community.org/)<br>
[Vue Newsletter](https://vuejsdevelopers.com/newsletter/)<br>
<br>

### Customize configuration

See [Configuration Reference](https://vitejs.dev/guide/).

<br>

### CASL

#### CASL Format

```javascript
;[
  {
    action: 'read',
    subject: 'user'
  },
  {
    action: 'edit',
    subject: 'user'
  },
  {
    action: 'create',
    subject: 'user'
  },
  {
    action: 'delete',
    subject: 'user'
  }
]
```

#### How to use CASL in Vue Template

```html
<template>
  <div>
    <div v-if="$can('read', 'user')">Can Read User<div>
    <div v-if="$can('edit', 'user')">Can Edit User<div>
    <div v-if="$can('create', 'user')">Can Create User<div>
    <div v-if="$can('delete', 'user')">Can Delete User<div>
  </div>
</template>
```

#### How to use CASL in Vue Router

```javascript
{
  path: "/user/list",
  name: "user",
  component: () => import("@/modules/user/list/User.vue"),
  meta: {
    subject: "user",
    action: "read",
  }
},
```

```javascript
if (!canNavigate(to)) {
  // Redirect to login if not logged in
  if (!isLoggedIn) return next({ name: 'login' })

  // If logged in => not authorized
  return next({ name: 'not-authorized' })
}
```

See [Components](COMPONENTS.md).
