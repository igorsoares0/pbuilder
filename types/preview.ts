export type PreviewMode = 'desktop' | 'tablet' | 'mobile';

export interface PreviewConfig {
  mode: PreviewMode;
  width: number;
  height: number;
}

export interface CodePreview {
  code: string;
  language: string;
  framework?: string;
}

export const PREVIEW_MODES: Record<PreviewMode, PreviewConfig> = {
  desktop: {
    mode: 'desktop',
    width: 1920,
    height: 1080,
  },
  tablet: {
    mode: 'tablet',
    width: 768,
    height: 1024,
  },
  mobile: {
    mode: 'mobile',
    width: 375,
    height: 667,
  },
};
