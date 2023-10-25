import "gitalk/dist/gitalk.css";
import Gitalk from "gitalk";
import GitalkComponent from "gitalk/dist/gitalk-component";

export default function GitalkComment({
  slug,
  issueNumber,
}: {
  slug?: string;
  issueNumber?: number;
}) {
  return (
    <GitalkComponent
      options={
        {
          clientID: "4274b52149ad90c1579f",
          clientSecret: "d2e6b62be577f74592999b024c1feba89022f7e4", // no need to keep secrets
          repo: "blog",
          owner: "Nomango",
          admin: ["Nomango"],
          distractionFreeMode: false,
          language: "zh-CN",
          perPage: 10,
          id: slug,
          number: issueNumber,
        } as Gitalk.GitalkOptions
      }
    />
  );
}
