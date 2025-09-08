/**
 * Atomic Design System - Templates
 *
 * Templates consist mostly of groups of organisms stitched together to form
 * pages. Templates are page-level objects that place components into a layout
 * and articulate the design's underlying content structure.
 *
 * Templates should focus on layout and structure without including specific
 * data or content. They define the slots and regions where organisms live.
 */

export { AppTemplate } from './AppTemplate';
export { AuthTemplate } from './AuthTemplate';
export { ProfileTemplate } from './ProfileTemplate';

export type { AppTemplateProps } from './AppTemplate/AppTemplate.types';
export type { AuthTemplateProps } from './AuthTemplate/AuthTemplate.types';
export type { ProfileTemplateProps } from './ProfileTemplate/ProfileTemplate.types';
