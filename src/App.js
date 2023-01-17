import { Canvas, useFrame} from '@react-three/fiber';
import { useGLTF,OrbitControls, ContactShadows, ScrollControls, useScroll, Loader, Environment, Lightformer, useAnimations } from '@react-three/drei';
import * as THREE from "three"
import Effects from './Effects';
import { useState, useRef, Suspense } from 'react';
import { animated, useSpring, useSprings } from "react-spring"
import { LayerMaterial, Color, Depth } from 'lamina'
import { Perf } from 'r3f-perf';

const Car = (props) => {
  const model = useGLTF("./scene.gltf")
  const modelRef = useRef()
  const animations = useAnimations(model.animations, model.scene)
  const action = animations.actions.Animation
    action.repetitions=0
    action.clampWhenFinished=true
    action.play()
  useFrame((state,delta) => {
    props.div5 ? action.paused=false : action.paused=true;
    modelRef.current.rotation.set(
      0,
      0.1 + Math.cos(state.clock.elapsedTime / 4.5) / 10,
      0)
  })
  return (
    <primitive ref={modelRef} castShadow receiveShadow position={[0, 0, 0]} object={model.scene} {...props}/>
  )
}

const Scene = ({setDiv1, setDiv2, setDiv3, setDiv4, setDiv5, div5}) => {
  const scroll = useScroll()
  const lfRef = useRef()
  const purpleRingRef = useRef()
  const dirLightRef = useRef()
  const groundColor="#fa0202"
  
  
  useFrame((state,delta) => {
    const v = new THREE.Vector3()
    lfRef.current.position.lerp(
      new THREE.Vector3().set(
        (Math.sin(state.clock.elapsedTime / 5)),
        9.5,
        (Math.cos(state.clock.elapsedTime / 5) + 2)), 
      0.9
    )

    dirLightRef.current.position.lerp(
      new THREE.Vector3().set(
        (Math.sin(state.clock.elapsedTime) * 10) + 1,
        1,
        (Math.cos(state.clock.elapsedTime * 3 ))+ 1), 
      0.9
    )

    purpleRingRef.current.position.lerp(
      new THREE.Vector3().set(
        (Math.sin(state.clock.elapsedTime/3) * 10),
        6,
        (Math.cos(state.clock.elapsedTime * 3 ))-65), 
      0.1
    )
    
    //console.log("cos " + Math.cos(state.clock.elapsedTime))
    /*
    const r1 = scroll.range( 0 / 5, 1 / 5)
    const r2 = scroll.range( 1 / 5, 2 / 5)
    const r3 = scroll.range( 2 / 5, 3 / 5)
    const r4 = scroll.range( 3 / 5, 4 / 5)
    const r5 = scroll.range( 4 / 5, 5 / 5)
    */

    if (scroll.offset < 0.2) {
      state.camera.position.lerp(
      v.set(
        Math.sin(scroll.offset + 5), 
        -1.5, 
        10 + Math.sin(scroll.offset + state.clock.elapsedTime) + 2),
      0.5)
      state.camera.lookAt(0, 0.5 ,0)
      setDiv1(true)
      setDiv2(false)
    }
    if (scroll.offset >= 0.2 && scroll.offset < 0.4){
      state.camera.position.lerp(
      v.set(
        Math.sin(scroll.offset * 5 + 25) + 5 ,
        2, 
        20 + Math.cos(scroll.offset/5 + state.clock.elapsedTime)),
      0.05)
      setDiv2(true)
      setDiv1(false)
      setDiv3(false)
    }
    if (scroll.offset >= 0.4 && scroll.offset < 0.6)
    {
      state.camera.position.lerp(
      v.set(
        Math.sin(60 + scroll.offset * 10 + state.clock.elapsedTime/4) - 8,
        4.0, 
        Math.sin(scroll.offset) - 5 ), 
      0.05)
      state.camera.lookAt(3, -1 ,1)
      setDiv3(true)
      setDiv2(false)
      setDiv4(false)
    }
    if (scroll.offset >= 0.6 && scroll.offset < 0.8)
    {
      state.camera.position.lerp(
      v.set(
        Math.sin(scroll.offset * 2 ), 
        -28, 
        -12 + Math.cos(5 + scroll.offset * 5 + state.clock.elapsedTime/3)),
      0.04)
      state.camera.lookAt(0, 1 ,-1)
      setDiv4(true)
      setDiv3(false)
      setDiv5(false)
    }
    if (scroll.offset >= 0.8)
    {
      state.camera.position.lerp(
      v.set(
        Math.sin(scroll.offset*2 + 25) * 6,  
        0.5 + Math.sin(state.clock.elapsedTime*3), 
        Math.cos(12 + scroll.offset) * 11), 
      0.01)
      setDiv4(false)
      setDiv5(true)
      
    }
  })
    

  return (
    <>
    
    <Perf position="bottom-left"/>
    <Environment resolution={256}>
    <fog attach="fog" args={['black', 90, 100]} />
    <Car div5={div5}/>
      <ContactShadows 
        resolution={256} 
        frames={1} //frames 1 bakes shadows
        position={[0, 0.01, 0]} 
        scale={50} 
        blur={1} 
        far={1}
        
      />
      <ambientLight intensity={0.5}/>
      <directionalLight position={[2,2,0]} intensity={4}/>
      <directionalLight ref={dirLightRef} position={[0, 2, -2]} intensity={8}/>
      
      {/* GROUND */}
      <Lightformer color={groundColor} form="ring" intensity={1} rotation-x={Math.PI / 2} position={[0, 0.01, 0]} scale={[20, 5, 5]} />
      <Lightformer color={groundColor} form="ring" intensity={1} rotation-x={Math.PI / 2} rotation-z={90} position={[0, 0.01, 0]} scale={[20, 5, 5]} />
      <Lightformer color={groundColor} form="ring" intensity={1} rotation-x={Math.PI / 2} rotation-z={-90} position={[0, 0.01, 0]} scale={[20, 5, 5]} />
      {/* FRONT */}
      <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 3, 20]} scale={[20, 5, 5]} />
      <Lightformer form="ring" color="gold" intensity={3} scale={2} position={[0, 3, 17]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
      <Lightformer form="ring" color="gold" intensity={3} scale={2} position={[-2, 3, 17]} onUpdate={(self) => self.lookAt(0, 0, 0)} />

      {/* TOP */}
      <Lightformer ref={lfRef} intensity={25} rotation-x={- Math.PI * 0.5} scale={2.5} position={[0,1.5,1]} />
      <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -6]} scale={[35, 2, 1]} />
      <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -3]} scale={[35, 2, 1]} />
      <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 0]} scale={[35, 1, 1]} />
      <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 3]} scale={[35, 1, 1]} />
      <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 6]} scale={[35, 1, 1]} />
      <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 9]} scale={[35, 1, 1]} />
      <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 12]} scale={[35, 1, 1]} />
      <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 15]} scale={[35, 1, 1]} />
      <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-50, 2, 0]} scale={[100, 2, 15]} />
      <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[50, 2, 0]} scale={[100, 2, 15]} />

      {/* SIDES */}
      <Lightformer form="circle" color="pink" intensity={10} scale={2} position={[10, 3, 10]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
      <Lightformer form="circle" color="pink" intensity={10} scale={2} position={[-10, 3, 10]} onUpdate={(self) => self.lookAt(0, 0, 0)} />

      {/* BACK */}
      <Lightformer form="rect" color="#7bc3ed" intensity={3} scale-x={100} position={[0, 3, -25]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
      <Lightformer ref={purpleRingRef} form="circle" color="#9559de" intensity={8} scale={5} position={[4, 6, -65]} onUpdate={(self) => self.lookAt(0, 0, 0)} />

      <mesh scale={100} rotation-y={- Math.PI * 0.5} >
        <sphereGeometry args={[1, 64, 64]} />
        <LayerMaterial side={THREE.BackSide}>
          <Color color="#424040" alpha={1} mode="normal" />
          <Depth colorA="black" colorB="black" alpha={0.2} mode="normal" near={0} far={300} origin={[100, 100, 100]} />
        </LayerMaterial>
        
      </mesh>

      
      <Effects/>
    </Environment>
      
    </>
  )
}

function App() {
  const [div1, setDiv1 ] = useState(false)
  const [div2, setDiv2 ] = useState(false)
  const [div3, setDiv3 ] = useState(false)
  const [div4, setDiv4 ] = useState(false)
  const [div5, setDiv5 ] = useState(false)

  const text1 = [..."Lorem ipsum dolor sit amet"]
  const text2 = [..."Aliquam lorem justo"]
  const text3 = [..."Suspendisse ut eleifend nulla"]
  const text4 = [..."Aliquam magna nunc"]
  const text5 = [..."Vestibulum nec sapien"]
  const props1 = useSpring({
    from: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    to: div1 ? { opacity: 1, transform: 'translate3d(0,40px,0)' } : { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    //delay: 500,
  })
  const base1 = {
    config: { mass: 5, tension: 2000, friction: 200 },
    from: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    to: div1 ? { opacity: 1, transform: 'translate3d(0,40px,0)' } : { opacity: 0, transform: 'translate3d(0,-40px,0)' },
  }
  const springs1 = useSprings(text1.length, text1.map((t, i) => ({ ...base1, delay: 100 * i }))) 



  const props2 = useSpring({
    from: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    to: div2 ? { opacity: 1, transform: 'translate3d(0,40px,0)' } : { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    //delay: 500,
  })
  const base2 = {
    config: { mass: 5, tension: 2000, friction: 200 },
    from: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    to: div2 ? { opacity: 1, transform: 'translate3d(0,40px,0)' } : { opacity: 0, transform: 'translate3d(0,-40px,0)' },
  }
  const springs2 = useSprings(text2.length, text2.map((t, i) => ({ ...base2, delay: 100 * i }))) 



  const props3 = useSpring({
    from: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    to: div3 ? { opacity: 1, transform: 'translate3d(0,40px,0)' } : { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    //delay: 500,
  })
  const base3 = {
    config: { mass: 5, tension: 2000, friction: 200 },
    from: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    to: div3 ? { opacity: 1, transform: 'translate3d(0,40px,0)' } : { opacity: 0, transform: 'translate3d(0,-40px,0)' },
  }
  const springs3 = useSprings(text3.length, text3.map((t, i) => ({ ...base3, delay: 100 * i }))) 



  const props4 = useSpring({
    from: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    to: div4 ? { opacity: 1, transform: 'translate3d(0,40px,0)' } : { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    //delay: 500,
  })
  const base4 = {
    config: { mass: 5, tension: 2000, friction: 200 },
    from: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    to: div4 ? { opacity: 1, transform: 'translate3d(0,40px,0)' } : { opacity: 0, transform: 'translate3d(0,-40px,0)' },
  }
  const springs4 = useSprings(text4.length, text4.map((t, i) => ({ ...base4, delay: 100 * i }))) 


  
  const props5 = useSpring({
    from: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    to: div5 ? { opacity: 1, transform: 'translate3d(0,40px,0)' } : { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    //delay: 500,
  })
  const base5 = {
    config: { mass: 5, tension: 2000, friction: 200 },
    from: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    to: div5 ? { opacity: 1, transform: 'translate3d(0,40px,0)' } : { opacity: 0, transform: 'translate3d(0,-40px,0)' },
  }
  const springs5 = useSprings(text5.length, text5.map((t, i) => ({ ...base5, delay: 100 * i })))

  return (
    <>
    <Canvas 
      shadows 
      camera={ {position: [-10, 15, 15], fov: 15 }} gl={{ logarithmicDepthBuffer: true, antialias: false, stencil: false, depth: false}} dpr={[1, 1.5]}>
    <OrbitControls enableZoom={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2.25}/>
      <Suspense fallback={null}>
        <ScrollControls
          pages={5}
        >
            <Scene 
              setDiv1={setDiv1}
              setDiv2={setDiv2}
              setDiv3={setDiv3}
              setDiv4={setDiv4} 
              setDiv5={setDiv5} 
              div5={div5}
            />

        </ScrollControls>
      </Suspense>
    </Canvas>
    <Loader/>
    <div className="brand">
      minarechma@gmail
    </div>
    <div className="divWrap">
      <animated.div style={props1} className="div1" >
        {springs1.map((s, i) => {
            return (
              <animated.span key={`char${i}`} style={s}>
                {text1[i] === ' ' ? <>&nbsp;</> : text1[i]}
              </animated.span>
            )
          })}
      </animated.div>
      <animated.div style={props2} className="div2" >
        {springs2.map((s, i) => {
            return (
              <animated.span key={`char${i}`} style={s}>
                {text2[i] === ' ' ? <>&nbsp;</> : text2[i]}
              </animated.span>
            )
          })}
      </animated.div>
      <animated.div style={props3} className="div3" >
        {springs3.map((s, i) => {
            return (
              <animated.span key={`char${i}`} style={s}>
                {text3[i] === ' ' ? <>&nbsp;</> : text3[i]}
              </animated.span>
            )
          })}
      </animated.div>
      <animated.div style={props4} className="div4" >
        {springs4.map((s, i) => {
          return (
            <animated.span key={`char${i}`} style={s}>
              {text4[i] === ' ' ? <>&nbsp;</> : text4[i]}
            </animated.span>
          )
        })}
      </animated.div>
      <animated.div style={props5} className="div5" >
        {springs5.map((s, i) => {
            return (
              <animated.span key={`char${i}`} style={s}>
                {text5[i] === ' ' ? <>&nbsp;</> : text5[i]}
              </animated.span>
            )
          })}
      </animated.div>
    </div>
  
    </>
  );
}

export default App;
