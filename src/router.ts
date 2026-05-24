// Generouted, changes to this file will be overridden
/* eslint-disable */

import { components, hooks, utils } from "@generouted/react-router/client";

export type Path = `/` | `/battle` | `/lobby`;

// biome-ignore lint/complexity/noBannedTypes: generated code
export type Params = {};

export type ModalPath = never;

export const { Link, Navigate } = components<Path, Params>();
export const { useModals, useNavigate, useParams } = hooks<
	Path,
	Params,
	ModalPath
>();
export const { redirect } = utils<Path, Params>();
