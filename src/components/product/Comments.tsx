import { IProduct } from "@/types/products/product";
import { DiscussionEmbed } from "disqus-react";
import { useEffect, useState } from "react";
// import { FacebookProvider, Comments } from 'react-facebook';

const CommentSection = ({ product, variantId }: { variantId: string, product: IProduct }) => {
    const [loggedIn, setLoggedInStatus] = useState(false);
    const [loginPayload, setLoginPayload] = useState('');
    const [loginPublicKey, setLoginPublicKey] = useState('');
    const [loginTestField, setLoginTestField] = useState('');

    const handleLogin = async () => {
        fetch('/api/auth/disqus').then(res => res.json()).then(payload => {
            setLoginPayload(`Payload: ${payload.auth}`);
            setLoginPublicKey(`Public Key: ${payload.pubKey}`);
            setLoginTestField(`Test Field: ${payload.test}`);
            setLoggedInStatus(true);
            reset(payload.auth);
        })
            .catch(err => console.error(err))
    }

    const handleLogout = () => {
        reset('e30= c1ad77866d19a308f133d18bb12a3e1f5d536a3b 1495142696');
        setLoggedInStatus(false);
    }

    const reset = (newAuth) => {
        console.log(newAuth);
        window.DISQUS.reset({
            reload: true,
            config: function () {
                this.page.remote_auth_s3 = newAuth;
            }
        });
    };
    useEffect(() => {
        window.disqus_config = function () {
            handleLogin();
        }
    }, []);
    return (
        <div>
            <div>
                {process.env.NODE_ENV === "development" && <div id='login-logout-buttons'>
                    <button
                        onClick={handleLogout}
                    >
                        Log out user with empty SSO auth
                    </button>
                    <button
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                </div>}
                {process.env.NODE_ENV === "development" && <div className="hidden">
                    {loggedIn ? <div id='login-payload'>
                        <div>
                            {loginPayload}
                        </div>
                        <div>
                            {loginPublicKey}
                        </div>
                        <div>
                            {loginTestField}
                        </div>
                    </div> : null}
                </div>}
            </div>

            {/* <div id="commento"></div> */}
            {/* <div id="cusdis_thread"
                data-host="https://cusdis.com"
                data-app-id="0811c2aa-a1cf-418a-b7bd-3342575d3119"
                data-page-id="{{ PAGE_ID }}"
                data-page-url="{{ PAGE_URL }}"
                data-page-title="{{ PAGE_TITLE }}"
            ></div>
            <script async defer src="https://cusdis.com/js/cusdis.es.js"></script> */}
            {/* <FacebookProvider appId="441176508588399">
                <Comments href={"https://ranforte.vercel.app/products/" + product.id + "&variant=" + variantId} />
            </FacebookProvider> */}
            <DiscussionEmbed
                shortname="3decomstore"
                config={{
                    url: "https://ranforte.vercel.app/products/" + product.id + "&variant=" + variantId,
                    identifier: product.id + variantId,
                    title: product.name,
                    apiKey: process.env.NEXT_PUBLIC_DISQUS_PUBLIC_KEY,
                    language: "en", //e.g. for Traditional Chinese (Taiwan)
                    sso: {
                        name: "Ranforte",
                        button: "http://example.com/images/samplenews.gif",
                        icon: "http://ranforte.vercel.app/static/next.svg",
                        url: "https://ranforte.vercel.app/auth/login",
                        logout: "https://ranforte.vercel.app/auth/logout",
                        profile_url: "http://example.com/profileUrlTemplate/{username}",
                        width: "800",
                        height: "400",
                    },
                }}
            />
        </div>
    )
}
export default CommentSection;