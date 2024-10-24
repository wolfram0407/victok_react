import { createGlobalStyle } from "styled-components";
import { color } from "./theme";

const GlobalStyle = createGlobalStyle`
    /* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

html{
    font-size: 62.5%;
	--antd-wave-shadow-color: #162d59;
  	--scroll-bar: 0;
}
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
* & :not(.ant-table-content, .devicePreview, .slideBar) {
		box-sizing: border-box;
		::-webkit-scrollbar {
		display: none;
	  }
	  -ms-overflow-style: auto;
}
#root {
  min-width: 1000px;
  min-height: 100vh;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
	-moz-appearance: none;
}
.textarea {
	outline-color: none;
	box-direction: none;
	:focus {
		outline-color: none;
		border: none;
	}
	:hover{
		outline-color: none;
	}
}

.ant-table .ant-table-container .ant-table-content table tbody .ant-table-row .ant-table-cell.ant-table-cell-row-hover {
	background: ${color.skyBlue};
}

.ant-table-row.white {
  background: #ffffff;
}

.ant-table-row.grey {
  background: #f9f9f9;
  color: #ccc;
}
.ant-table-row.skyblue {
  background: #f4fbff;
  color: #333;
  font-weight: 600;
}
.ant-radio-button-wrapper:not(:first-child)::before {
	display: none;
}
.ant-btn-primary {
  color: #fff;
  border-color: #162d59;
  background: #162d59;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
}
.ant-btn-primary > a:only-child {
  color: currentColor;
}
.ant-btn-primary > a:only-child::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: transparent;
  content: '';
}
.ant-btn-primary:hover,
.ant-btn-primary:focus {
  color: #fff;
  border-color: #2a4166;
  background: #2a4166;
}
.ant-btn-primary:hover > a:only-child,
.ant-btn-primary:focus > a:only-child {
  color: currentColor;
}
.ant-btn-primary:hover > a:only-child::after,
.ant-btn-primary:focus > a:only-child::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: transparent;
  content: '';
}
.ant-btn-primary:active {
  color: #fff;
  border-color: #0a1733;
  background: #0a1733;
}
.ant-btn-primary:active > a:only-child {
  color: currentColor;
}
.ant-btn-primary:active > a:only-child::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: transparent;
  content: '';
}
.ant-btn-primary[disabled],
.ant-btn-primary[disabled]:hover,
.ant-btn-primary[disabled]:focus,
.ant-btn-primary[disabled]:active {
  color: rgba(0, 0, 0, 0.25);
  border-color: #d9d9d9;
  background: #f5f5f5;
  text-shadow: none;
  box-shadow: none;
}
.ant-btn-primary[disabled] > a:only-child,
.ant-btn-primary[disabled]:hover > a:only-child,
.ant-btn-primary[disabled]:focus > a:only-child,
.ant-btn-primary[disabled]:active > a:only-child {
  color: currentColor;
}
.ant-btn-primary[disabled] > a:only-child::after,
.ant-btn-primary[disabled]:hover > a:only-child::after,
.ant-btn-primary[disabled]:focus > a:only-child::after,
.ant-btn-primary[disabled]:active > a:only-child::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: transparent;
  content: '';
}
.ant-pagination {
	.ant-pagination-item {
		display: inline-block;
		min-width: 32px;
		height: 32px;
		margin-right: 8px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
			'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
		line-height: 30px;
		text-align: center;
		vertical-align: middle;
		list-style: none;
		background-color: #fff;
		border: 1px solid #d9d9d9;
		border-radius: 2px;
		outline: 0;
		cursor: pointer;
		user-select: none;
	}
	.ant-pagination-item a:hover {
	text-decoration: none;
	}
	.ant-pagination-item:focus-visible,
	.ant-pagination-item:hover {
	border-color: #162d59;
	transition: all 0.3s;
	}
	.ant-pagination-item:focus-visible a,
	.ant-pagination-item:hover a {
	color: #162d59;
	}
	.ant-pagination-item-active {
	font-weight: 500;
	background: #fff;
	border-color: #162d59;
	}
	.ant-pagination-item-active a {
	color: #162d59;
	}
	.ant-pagination-item-active:focus-visible,
	.ant-pagination-item-active:hover {
	border-color: #2a4166;
	}
	.ant-pagination-item-active:focus-visible a,
	.ant-pagination-item-active:hover a {
	color: #2a4166;
	}
	.ant-pagination-jump-prev,
	.ant-pagination-jump-next {
	outline: 0;
	}
	.ant-pagination-jump-prev .ant-pagination-item-container,
	.ant-pagination-jump-next .ant-pagination-item-container {
	position: relative;
	}
	.ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-link-icon,
	.ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-link-icon {
	color: #162d59;
	font-size: 12px;
	letter-spacing: -1px;
	opacity: 0;
	transition: all 0.2s;
	}
	.ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-link-icon-svg,
	.ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-link-icon-svg {
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	margin: auto;
	}
	.ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-ellipsis,
	.ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-ellipsis {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: block;
	margin: auto;
	color: rgba(0, 0, 0, 0.25);
	font-family: Arial, Helvetica, sans-serif;
	letter-spacing: 2px;
	text-align: center;
	text-indent: 0.13em;
	opacity: 1;
	transition: all 0.2s;
	}
	.ant-pagination-jump-prev:focus-visible .ant-pagination-item-link-icon,
	.ant-pagination-jump-next:focus-visible .ant-pagination-item-link-icon,
	.ant-pagination-jump-prev:hover .ant-pagination-item-link-icon,
	.ant-pagination-jump-next:hover .ant-pagination-item-link-icon {
	opacity: 1;
	}
	.ant-pagination-jump-prev:focus-visible .ant-pagination-item-ellipsis,
	.ant-pagination-jump-next:focus-visible .ant-pagination-item-ellipsis,
	.ant-pagination-jump-prev:hover .ant-pagination-item-ellipsis,
	.ant-pagination-jump-next:hover .ant-pagination-item-ellipsis {
	opacity: 0;
	}
	.ant-pagination-prev,
	.ant-pagination-jump-prev,
	.ant-pagination-jump-next {
	margin-right: 8px;
	}
	.ant-pagination-prev .ant-pagination-item-link,
	.ant-pagination-next .ant-pagination-item-link {
	display: block;
	width: 100%;
	height: 100%;
	padding: 0;
	font-size: 12px;
	text-align: center;
	background-color: #fff;
	border: 1px solid #d9d9d9;
	border-radius: 2px;
	outline: none;
	transition: all 0.3s;
	}
}
::selection {
	color: #fff;
	background: #162d59;
}
.ant-checkbox.ant-checkbox-wrapper:hover .ant-checkbox-inner,
.ant-checkbox.ant-checkbox:hover .ant-checkbox-inner,
.ant-checkbox.ant-checkbox-input:focus + .ant-checkbox-inner {
	border-color: #162d59;
}
.ant-checkbox.ant-checkbox-checked.ant-checkbox:not(.ant-checkbox-disabled):hover .ant-checkbox-inner {
	background-color: #162d59;
}
.ant-checkbox.ant-checkbox-checked::after {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border: 1px solid #162d59;
	border-radius: 2px;
	visibility: hidden;
	animation: antCheckboxEffect 0.36s ease-in-out;
	animation-fill-mode: backwards;
	content: '';
}
.ant-checkbox .ant-checkbox-inner {
	border-radius: 2px;
}
.ant-checkbox-checked:not(.ant-checkbox-disabled) .ant-checkbox-inner {
	border-radius: 2px;
	background-color: #162d59;
	border-color: #162d59;
}
.ant-select.ant-select-disabled.adminDriller .ant-select-selector {
	background: inherit;
	color: inherit;
}
.ant-checkbox-wrapper.ant-checkbox-wrapper-disabled.adminDriller span {
	background-color: inherit;
	color: inherit;
}
.ant-checkbox-wrapper.ant-checkbox-wrapper-disabled.adminDriller .ant-checkbox-checked .ant-checkbox-inner {
	background-color: #162d59;
}
.ant-checkbox-wrapper.ant-checkbox-wrapper-disabled.adminDriller .ant-checkbox-inner::after {
	border-color: inherit;
}
span[title] {
	pointer-events: none;
}
`;

export default GlobalStyle;
