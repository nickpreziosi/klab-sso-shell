"use client"

import * as React from "react"

export interface KHubLogoProps extends React.SVGProps<SVGSVGElement> {
  variant?: "dark" | "light" | "white" | "black" | "color"
}

const KHubLogoDarkSvg = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 12 320 88" {...props}>
      {/* K Labs brand mark */}
      <path
        d="M1.5,66.18l34.29-30.39c1.05-.97,2.74-.2,2.71,1.22l-.39,17.02c-.04,1.75-.82,3.41-2.15,4.55l-13.95,10.96c-1.17,1.01-2.67,1.55-4.21,1.51l-14.58-.34c-2.35-.05-3.44-2.94-1.72-4.54Z"
        fill="#171920"
      />
      <path
        d="M.5,19.4l23.06,24.07,12.07-10.7c.67-.62,1.61-.53,2.19,0-.04-.37-.19-.72-.44-1l-11.96-13.34c-1.1-1.23-2.67-1.93-4.31-1.94l-19.31-.1c-1.58,0-2.39,1.88-1.3,3.02Z"
        fill="#171920"
      />
      <text
        x="48"
        y="84"
        fontSize="93"
        fontWeight="600"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        fill="#171920"
        letterSpacing="-3"
      >
        K Hub
      </text>
    </svg>
  )
)
KHubLogoDarkSvg.displayName = "KHubLogoDarkSvg"

const KHubLogoLightSvg = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 12 320 88" {...props}>
      {/* K Labs brand mark */}
      <path
        d="M1.5,66.18l34.29-30.39c1.05-.97,2.74-.2,2.71,1.22l-.39,17.02c-.04,1.75-.82,3.41-2.15,4.55l-13.95,10.96c-1.17,1.01-2.67,1.55-4.21,1.51l-14.58-.34c-2.35-.05-3.44-2.94-1.72-4.54Z"
        fill="#ffffff"
      />
      <path
        d="M.5,19.4l23.06,24.07,12.07-10.7c.67-.62,1.61-.53,2.19,0-.04-.37-.19-.72-.44-1l-11.96-13.34c-1.1-1.23-2.67-1.93-4.31-1.94l-19.31-.1c-1.58,0-2.39,1.88-1.3,3.02Z"
        fill="#ffffff"
      />
      <text
        x="48"
        y="84"
        fontSize="93"
        fontWeight="600"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        fill="#ffffff"
        letterSpacing="-3"
      >
        K Hub
      </text>
    </svg>
  )
)
KHubLogoLightSvg.displayName = "KHubLogoLightSvg"

export const KHubLogo = React.forwardRef<SVGSVGElement, KHubLogoProps>(
  ({ variant = "color", className, ...props }, ref) => {
    if (variant === "light" || variant === "white") {
      return <KHubLogoLightSvg ref={ref} className={className} {...props} />
    }
    if (variant === "dark" || variant === "black") {
      return <KHubLogoDarkSvg ref={ref} className={className} {...props} />
    }

    return (
      <>
        <KHubLogoDarkSvg
          ref={ref}
          className={[className, "inline dark:hidden"].filter(Boolean).join(" ")}
          {...props}
        />
        <KHubLogoLightSvg
          className={[className, "hidden dark:inline"].filter(Boolean).join(" ")}
          {...props}
        />
      </>
    )
  }
)

KHubLogo.displayName = "KHubLogo"
