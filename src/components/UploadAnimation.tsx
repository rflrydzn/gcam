const UploadAnimation = () => {
  return (
    <div>
      <div className="loadingCircle"></div>
      <p className="">Uploading...</p>
      <style jsx>{`
        .loadingCircle {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 6px solid var(--checkmark-border);
          border-top-color: var(
            --checkmark-fill
          ); /* color of the animated segment */
          animation: spin 1s linear infinite;
          margin: 0 auto;
          margin-bottom: 26px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default UploadAnimation;
