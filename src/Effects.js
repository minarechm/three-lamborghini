import { EffectComposer, SSR, Bloom, DepthOfField, SSAO } from "@react-three/postprocessing";
import { useControls } from 'leva'

export default function Effects() {
    const { enabled, ...props } = useControls({
        enabled: true,

        //focusDistance: { value: 1, min:-250, max:250},
        //focalLength: { value: 1, min:-250, max:250},
        //bokehScale: { value: 1, min:-250, max:250},

        temporalResolve: true,
        STRETCH_MISSED_RAYS: true,
        USE_MRT: true,
        USE_NORMALMAP: true,
        USE_ROUGHNESSMAP: true,
        ENABLE_JITTERING: true,
        ENABLE_BLUR: true,
        DITHERING: false,
        temporalResolveMix: { value: 0.9, min: 0, max: 1 },
        temporalResolveCorrectionMix: { value: 0.4, min: 0, max: 1 },
        maxSamples: { value: 0, min: 0, max: 1 },
        resolutionScale: { value: 1, min: 0, max: 1 },
        blurMix: { value: 0.2, min: 0, max: 1 },
        blurKernelSize: { value: 8, min: 0, max: 8 },
        blurSharpness: { value: 0.5, min: 0, max: 1 },
        rayStep: { value: 0.43, min: 0, max: 1 },
        intensity: { value: 0.4, min: 0, max: 5 },
        maxRoughness: { value: 1, min: 0, max: 1 },
        jitter: { value: 0.3, min: 0, max: 5 },
        jitterSpread: { value: 1, min: 0, max: 1 },
        jitterRough: { value: 0.1, min: 0, max: 1 },
        roughnessFadeOut: { value: 1, min: 0, max: 1 },
        rayFadeOut: { value: 0, min: 0, max: 1 },
        MAX_STEPS: { value: 20, min: 0, max: 20 },
        NUM_BINARY_SEARCH_STEPS: { value: 6, min: 0, max: 10 },
        maxDepthDifference: { value: 5, min: 0, max: 10 },
        maxDepth: { value: 1, min: 0, max: 1 },
        thickness: { value: 3, min: 0, max: 10 },
        ior: { value: 1.5, min: 1, max: 2 }
    })
    return(
        <>
        {enabled &&
            <EffectComposer 
            multisampling={8} //default 8
            disableNormalPass
            > 
            
              {/*<Bloom mipmapBlur/>*/}
              {/*<DepthOfField
                focusDistance= {props.focusDistance}
                focalLength={props.focalLength}
                bokehScale={props.bokehScale}
                />
            */}
                <SSR 
                    temporalResolve={props.temporalResolve}
                    STRETCH_MISSED_RAYS={props.STRETCH_MISSED_RAYS}
                    USE_MRT={props.USE_MRT}
                    USE_NORMALMAP={props.USE_NORMALMAP}
                    USE_ROUGHNESSMAP={props.USE_ROUGHNESSMAP}
                    ENABLE_JITTERING={props.ENABLE_JITTERING}
                    ENABLE_BLUR={props.ENABLE_BLUR}
                    DITHERING={props.DITHERING}
                    temporalResolveMix={props.temporalResolveMix}
                    temporalResolveCorrectionMix={props.temporalResolveCorrectionMix}
                    maxSamples={props.maxSamples}
                    resolutionScale={props.resolutionScale}
                    blurMix={props.blurMix}
                    blurKernelSize={props.blurKernelSize}
                    BLUR_EXPONENT={props.BLUR_EXPONENT}
                    rayStep={props.rayStep}
                    intensity={props.intensity}
                    maxRoughness={props.maxRoughness}
                    jitter={props.jitter}
                    jitterSpread={props.jitterSpread}
                    jitterRought={props.jitterRough}
                    roughnessFadeOut={props.roughnessFadeOut}
                    rayFadeOut={props.rayFadeOut}
                    MAX_STEPS={props.MAX_STEPS}
                    NUM_BINARY_SEARCH_STEPS={props.NUM_BINARY_SEARCH_STEPS}
                    maxDepthDifference={props.maxDepthDifference}
                    maxDepth={props.maxDepth}
                    thickness={props.thickness}
                    ior={props.ior}

                />
                <Bloom mipmapBlur luminanceThreshold={0.2} luminanceSmoothing={0} intensity={0.9} />
            </EffectComposer>
        }
        </>
)}