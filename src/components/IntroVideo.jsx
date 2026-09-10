import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

/**
 * 10X Technologies - Production Intro Video
 * 
 * Delivers a true full-viewport, cinematic intro using the approved 10X video asset.
 * - Rendered directly into document.body via React Portal to completely bypass
 *   any page/container max-width, flexbox, or grid constraints.
 * - Viewport is 100% pure black with zero UI, navbar, or homepage visibility.
 * - Autoplays inline and muted with strict browser policy compliance.
 * - Scales cleanly to 16:9 Full HD without distortion or unnatural cropping.
 * - Uses the video's natural 'ended' event to initiate a smooth 600ms cross-dissolve.
 * - Keeps the final video frame rock-solid while dissolving seamlessly into the homepage.
 * - Strict scroll-locking and touch-bounce prevention during intro playback.
 * - Includes safe fallback to ensure the user is never stranded on a black screen.
 */

const VIDEO_SRC = '/10X-pixelated%20(1).mp4';

const IntroVideo = ({ onDissolve, onComplete }) => {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const [isFading, setIsFading] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const completedRef = useRef(false);

  // Transition handoff: pause on final frame, begin dissolve, then safely unmount
  const handleEnded = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    // A. Keep the final video frame visible and stable by pausing it
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch (e) {
        // Ignore if already paused
      }
    }

    // B & C. Begin smooth visual dissolve handoff
    setIsFading(true);
    if (typeof onDissolve === 'function') {
      onDissolve();
    }

    // D & E. After smooth dissolve transition completes, safely unmount video layer
    setTimeout(() => {
      setIsUnmounted(true);
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, 900);
  }, [onDissolve, onComplete]);

  // Lock document scrolling, wheel, and touchmove during intro playback
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';

    window.scrollTo(0, 0);

    // Passive-false listeners to completely block touch/wheel gestures on viewport
    const preventScroll = (e) => {
      e.preventDefault();
    };

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });

    // Failsafe backstop timeout (12s) in case network streaming stalls completely
    const safetyTimeout = setTimeout(() => {
      if (!completedRef.current) {
        console.warn('[IntroVideo] Safety backstop triggered.');
        handleEnded();
      }
    }, 12000);

    return () => {
      clearTimeout(safetyTimeout);
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      document.body.style.overflow = prevOverflow || '';
      document.body.style.overscrollBehavior = prevOverscroll || '';
    };
  }, [handleEnded]);

  // Direct DOM property enforcement for iOS/Safari muted autoplay compliance
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('[IntroVideo] Autoplay prevented by browser:', err);
        handleEnded();
      });
    }
  }, [handleEnded]);

  if (isUnmounted || typeof document === 'undefined') {
    return null;
  }

  const overlayContent = (
    <div
      ref={overlayRef}
      id="luca-intro-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        maxWidth: 'none',
        maxHeight: 'none',
        margin: 0,
        padding: 0,
        backgroundColor: '#000000',
        zIndex: 99999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: isFading ? 'none' : 'auto',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        transform: isFading ? 'translateY(-40px)' : 'translateY(0px)',
        transition: 'opacity 750ms cubic-bezier(0.16, 1, 0.3, 1), transform 850ms cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isFading ? 0 : 1,
      }}
      aria-label="10X Technologies Intro Video"
      role="region"
    >
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        autoPlay
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        onEnded={handleEnded}
        onError={(e) => {
          console.warn('[IntroVideo] Video playback encountered error:', e);
          handleEnded();
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          minWidth: '100%',
          minHeight: '100%',
          maxWidth: 'none',
          maxHeight: 'none',
          margin: 0,
          padding: 0,
          display: 'block',
          objectFit: 'cover',
          objectPosition: 'center',
          backgroundColor: '#000000',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
    </div>
  );

  return createPortal(overlayContent, document.body);
};

export default IntroVideo;
