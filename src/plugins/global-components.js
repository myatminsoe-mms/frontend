import BadgeDirective from 'primevue/badgedirective'
import Ripple from 'primevue/ripple'
import StyleClass from 'primevue/styleclass'
import Tooltip from 'primevue/tooltip'
// import CodeHighlight from '@/libs/AppCodeHighlight';

import { app } from './main-app'

app.directive('tooltip', Tooltip)
app.directive('ripple', Ripple)
// app.directive('code', CodeHighlight);
app.directive('badge', BadgeDirective)
app.directive('styleclass', StyleClass)
