import { useEffect, useState } from 'react';

const Description = ({ description, slug }: { description: string; slug: string }) => {
  const descriptionInjectionScript = `<script>window.onload = () => window.parent.postMessage((document.body.clientHeight + 400) + 'px', '*');</script>`;
  const [height, setHeight] = useState('20rem');
  const handleHeightMessage = (e) => setHeight(e.data);
  useEffect(() => {
    window.addEventListener("message", handleHeightMessage);
    return () => window.removeEventListener("message", handleHeightMessage);
  }, []);
    console.log(description)
    console.log(slug)

    function isLastCharNumber(str: any) {
      const lastChar = str.charAt(str.length - 1);
      return !isNaN(Number(lastChar));
    }
  return (
    <>
      {slug ? (
        isLastCharNumber(slug) ? (
     <iframe className="w-full" sandbox="allow-scripts" allow="vertical-scroll 'none'" style={{ height: '400px' }} src={`https://callbackitty.kabeer11000.workers.dev/?s=${encodeURIComponent(description + descriptionInjectionScript)}`}></iframe>

          
        ) : (
          <iframe
            className="w-full"
            sandbox="allow-scripts"
            allow="vertical-scroll 'none'"
            style={{ height: '400px'}}
            src={`https://callbackitty.kabeer11000.workers.dev/?s=${encodeURIComponent(
              description + descriptionInjectionScript
            )}`}
          ></iframe>
        )
      ) : (
        <div>Loading...</div>
      )}
    </>
   
  );
};

export default Description;
