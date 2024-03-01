import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={47}
      height={45}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M31.593 30.577c-.18 1.257-.364 2.513-.537 3.77-.402 2.919-.797 5.838-1.196 8.757-.036.264-.072.529-.104.794-.058.49-.287.674-.765.595a25.451 25.451 0 01-11.737-5.216 1.858 1.858 0 01-.356-.34c-.181-.249-.132-.48.063-.723 1.874-2.326 3.74-4.658 5.609-6.989.07-.088.133-.185.2-.277.069-.075.142-.145.204-.224 1.475-1.845 2.95-3.69 4.423-5.536l2.825-3.543 1.528-1.915-.004.002.094-.148-.01.006.08-.085-.01.004.102-.083.657-.881.001-.003.441-.573c.068-.01.136-.02.204-.032l-.044.859c-.04.073-.107.143-.116.22-.125.946-.24 1.893-.36 2.84l-.116.768-.233 1.766c-.15 1.067-.297 2.133-.446 3.2l-.397 2.987z"
        fill="#D359A5"
      />
      <Path
        d="M38.957 29.702c.778 1.637 1.554 3.275 2.332 4.911.371.779.75 1.553 1.12 2.332.226.474.134.712-.36.93a19.711 19.711 0 01-9.808 1.608c-.436-.038-.575-.225-.536-.692l.69-8.083a.147.147 0 01.034-.024c2.244.214 4.414-.053 6.481-.993a.936.936 0 00.047.01z"
        fill="#019540"
      />
      <Path
        d="M14.644 23.748c-.923.276-1.848.543-2.767.83-3.545 1.109-7.09 2.224-10.634 3.336-.082.026-.167.046-.312.084l-.798-2.981 2.933-.636 10.9-2.358c.06-.014.117-.041.176-.062l2.734-.572c1.065-.226 2.13-.447 3.195-.678 2.821-.61 5.642-1.226 8.463-1.839.53-.11 1.059-.224 1.59-.327.74-.144 1.48-.28 2.222-.418l.03.075-.165.072c-.063.002-.13-.012-.186.006-1.09.346-2.178.695-3.265 1.044-.16.04-.322.071-.479.12-2.82.881-5.638 1.761-8.456 2.647-.845.266-1.685.548-2.527.823-.886.278-1.77.555-2.654.834z"
        fill="#365E9B"
      />
      <Path
        d="M38.96 29.702l-.048-.01-.651-1.407-.741-1.61c.074-.013.157-.009.221-.042a9.892 9.892 0 003.07-2.452c1.524-1.807 2.236-3.933 2.301-6.286.035-.006.071-.012.106-.02l2.01-.003 1.388.004-.022-.011c.004.488.069.984.002 1.46-.667 4.712-3.11 8.152-7.403 10.25-.08.04-.156.085-.234.127z"
        fill="#FABD01"
      />
      <Path
        d="M21.97 30.244c-.815.871-1.634 1.737-2.443 2.613-2.558 2.772-5.112 5.547-7.67 8.32-.337.365-.378.362-.722.022a107.34 107.34 0 01-1.32-1.32c-.327-.337-.329-.416.024-.739 1.237-1.13 2.48-2.255 3.723-3.381 2.361-2.142 4.723-4.281 7.083-6.424.074-.067.137-.147.205-.222l.057.001 1.063 1.064v.066z"
        fill="#EA8B0C"
      />
      <Path
        d="M16.875 21.39l-2.734.57c-.52-2.358-.537-4.732-.207-7.115a.085.085 0 01.026-.029c3.204.52 6.407 1.037 9.611 1.556l-.15 1.366c-2.029-.022-4.057-.046-6.085-.065-.714-.006-.834.082-.783.814.07.97.212 1.935.322 2.902z"
        fill="#77C2B4"
      />
      <Path
        d="M19.314 27.14l-1.244-2.2c.01-.02.016-.04.017-.063.2-.078.405-.147.6-.238.826-.387 1.65-.784 2.476-1.173l7.677-3.612a.164.164 0 00.072 0l.325.67-4.298 2.885-5.56 3.735a.356.356 0 00-.065-.003z"
        fill="#FCEA00"
      />
      <Path
        d="M19.314 27.14a.46.46 0 01.064.004l.85 1.213a.204.204 0 000 .048l-5.526 4.434c-.535.43-1.072.858-1.603 1.291-.235.193-.414.23-.61-.074a13.459 13.459 0 00-.899-1.228c-.217-.266-.13-.417.112-.576.625-.412 1.245-.832 1.868-1.248 1.846-1.234 3.692-2.468 5.537-3.704.072-.048.138-.106.207-.16z"
        fill="#0077D8"
      />
      <Path
        d="M21.968 30.244v-.065c.711-.772 1.418-1.545 2.131-2.314 1.095-1.178 2.195-2.35 3.288-3.53.378-.408.733-.837 1.113-1.242.537-.571 1.088-1.13 1.633-1.694l.084.246a7937.435 7937.435 0 01-7.247 9.078c-.064.08-.137.15-.205.225-.265-.235-.53-.47-.797-.704zM20.229 28.405a.204.204 0 010-.048c.083-.055.172-.106.25-.168 1.74-1.403 3.478-2.809 5.22-4.21 1.266-1.018 2.537-2.03 3.806-3.044l.18.17c-.42.402-.833.813-1.264 1.204-1.537 1.395-3.082 2.78-4.622 4.173-.966.875-1.928 1.755-2.892 2.634a.455.455 0 00-.058-.001l-.62-.71z"
        fill="#FCEA00"
      />
      <Path
        d="M18.087 24.877a.159.159 0 01-.017.062c-.65.305-1.314.59-1.948.925-.36.19-.604.1-.743-.22-.27-.622-.493-1.263-.736-1.897.885-.278 1.77-.556 2.653-.835l.791 1.965z"
        fill="#77C2B4"
      />
      <Path
        d="M31.592 30.577l.397-2.989.654.07c-.006.15-.005.302-.016.453-.065.858-.13 1.715-.197 2.572a.15.15 0 00-.034.024l-.804-.13z"
        fill="#FABD01"
      />
      <Path
        d="M33.92 16.597l.087.066c-.072.1-.144.2-.215.302h-.932l-.2-.338a.09.09 0 01.02-.038l1.137-.08-.013.002.117.086z"
        fill="#77C2B4"
      />
      <Path
        d="M32.66 16.626l.199.339-.416.43-.377-.3-.188.533-.564-.083-2.781-.407c-.7-.12-1.399-.247-2.101-.354-.952-.146-1.906-.275-2.86-.412l-9.611-1.556c.28-1.129.506-2.274.85-3.383a14.811 14.811 0 012.034-4.115c.292-.418.474-.425.878-.145 3.723 2.585 7.445 5.17 11.17 7.752.123.087.259.155.39.232l2.753 1.927.467-.41.157-.048z"
        fill="#77C2B4"
      />
      <Path
        d="M20.907 29.115c.964-.878 1.927-1.758 2.893-2.633 1.54-1.393 3.085-2.78 4.622-4.174.431-.39.842-.802 1.264-1.204.036-.011.081-.011.107-.033.66-.6 1.321-1.197 1.974-1.804.065-.06.08-.173.12-.261l.62-.594c0-.044 0-.088-.002-.132.124-.085.242-.178.372-.252.064-.037.147-.04.221-.06l-.44.573-.014-.122-.045.015.058.11-.657.88-.103.084.01-.004-.08.086.01-.006-.093.147.004-.002-1.612 1.67c-.545.563-1.096 1.122-1.633 1.693-.38.406-.736.835-1.113 1.243-1.093 1.179-2.195 2.351-3.288 3.53-.714.768-1.421 1.542-2.13 2.313l-1.065-1.063z"
        fill="#EA8B0C"
      />
      <Path
        d="M33.096 17.968c-.075.018-.158.022-.221.059-.13.075-.25.167-.372.252l-.129-.078-.03-.075-.007-.385.104-.346.416-.43.933-.001c.238.265.496.52.488.916-.014.41-.151.736-.59.852l-.388-.796-.204.032z"
        fill="#DCEBD9"
      />
      <Path
        d="M32.643 27.658l-.654-.07.445-3.199.464.09c-.04.602-.076 1.206-.118 1.808-.032.46-.072.92-.108 1.38l-.03-.009z"
        fill="#D9AF01"
      />
      <Path
        d="M32.897 24.477l-.463-.089.233-1.766.364.004-.106 1.851h-.028z"
        fill="#DCEBD9"
      />
      <Path
        d="M32.782 21.855c.119-.947.235-1.894.36-2.84.01-.076.076-.146.116-.22l.02.469-.18 2.596-.316-.005z"
        fill="#F6ED7F"
      />
      <Path
        d="M30.134 21.398l1.612-1.669-1.527 1.916-.085-.247z"
        fill="#F0D501"
      />
      <Path
        d="M33.28 19.263l-.02-.468.043-.859.387.797.191.387a.659.659 0 01-.005.067l-.596.076z"
        fill="#016F00"
      />
      <Path
        d="M32.783 21.855l.315.004-.031.753a.08.08 0 01-.036.015l-.364-.004.116-.768z"
        fill="#D6DB6F"
      />
      <Path
        d="M31.743 19.73l.094-.146-.094.147zM31.827 19.59l.08-.086-.08.086zM31.898 19.507l.103-.083-.103.083z"
        fill="#F0D501"
      />
      <Path
        d="M34.573 17.277l.07.383-.028.234-.336-.014c.008-.396-.25-.65-.489-.915l.215-.302.568.614z"
        fill="#76B302"
      />
      <Path
        d="M33.92 16.597a86.9 86.9 0 01-.117-.088l.117.088z"
        fill="#FEFEFE"
      />
      <Path
        d="M32.43 30.684c.065-.857.133-1.715.197-2.572.011-.15.01-.303.016-.454l.028.009c1.085.016 2.174.024 3.216-.322.54-.18 1.052-.448 1.576-.676.018.007.037.01.056.007l.741 1.61.65 1.406c-2.066.94-4.237 1.206-6.48.992z"
        fill="#016F00"
      />
      <Path
        d="M16.878 21.39c-.11-.968-.254-1.933-.322-2.903-.051-.732.068-.82.784-.813 2.028.019 4.056.042 6.084.064l5.037.076.075 1.057c-2.82.613-5.641 1.229-8.463 1.839-1.065.232-2.13.454-3.195.68zM18.087 24.877l-.791-1.964c.841-.275 1.682-.557 2.526-.823 2.818-.886 5.638-1.765 8.457-2.646.157-.049.32-.081.479-.12l.082.53c-2.559 1.204-5.118 2.407-7.677 3.613-.826.39-1.65.785-2.477 1.172-.194.091-.399.16-.599.238z"
        fill="#76B302"
      />
      <Path
        d="M28.532 18.872l-.076-1.057a.272.272 0 01.06-.03c1.074.011 2.148.024 3.222.03.055 0 .11-.048.166-.074l.434.001.006.385c-.741.139-1.482.274-2.222.418-.532.103-1.06.217-1.59.327z"
        fill="#72A603"
      />
      <Path
        d="M32.375 18.201l.13.078v.133c-.132.07-.272.128-.396.21-.96.631-1.915 1.268-2.872 1.902l-.325-.67c.293-.145.584-.293.879-.434.806-.384 1.612-.764 2.419-1.146l.165-.073z"
        fill="#F0D501"
      />
      <Path
        d="M32.208 18.274c-.806.382-1.613.762-2.419 1.146-.294.14-.586.29-.878.434a.164.164 0 01-.072 0l-.082-.53c1.088-.349 2.175-.698 3.265-1.044.057-.018.124-.004.186-.006z"
        fill="#72A603"
      />
      <Path
        d="M37.519 26.675a.107.107 0 01-.056-.007l-1.205-2.596c.113-.055.227-.11.34-.168 2.448-1.257 3.74-3.254 3.841-6.012l2.363-.029.309.033c-.065 2.352-.778 4.478-2.302 6.285a9.896 9.896 0 01-3.07 2.452c-.063.033-.146.03-.22.042z"
        fill="#D9AF01"
      />
      <Path
        d="M28.515 17.786a.306.306 0 00-.06.03l-5.036-.077.15-1.365c.953.136 1.908.266 2.86.411.703.107 1.4.235 2.101.354l-.015.647z"
        fill="#67B298"
      />
      <Path
        d="M29.238 20.524c.956-.634 1.913-1.27 2.871-1.902.124-.082.264-.14.396-.21l-.62.594-2.38 1.93c-1.269 1.013-2.54 2.025-3.806 3.043-1.742 1.401-3.48 2.807-5.22 4.21-.078.063-.168.113-.251.168-.283-.404-.566-.809-.85-1.212l5.562-3.735c1.432-.963 2.864-1.925 4.297-2.886z"
        fill="#0077D8"
      />
      <Path
        d="M29.505 20.934l2.38-1.929c-.038.089-.054.2-.12.261-.652.607-1.313 1.206-1.974 1.804-.025.023-.071.022-.107.033l-.18-.169z"
        fill="#F0D501"
      />
      <Path
        d="M45.695.283c.218-.145.339-.288.454-.283.103.005.198.173.297.27-.107.099-.202.252-.324.279-.091.019-.217-.128-.427-.266z"
        fill="#FBFBFB"
      />
      <Path
        d="M28.518 17.786l.015-.648 2.781.408.564.082.027.113c-.055.026-.11.074-.166.074-1.074-.007-2.148-.019-3.221-.03z"
        fill="#73B058"
      />
      <Path
        d="M31.906 17.741l-.026-.113.187-.532c.155.123.267.211.377.3-.034.116-.07.23-.103.346h-.435z"
        fill="#77C2B4"
      />
      <Path
        d="M32.656 18.543c-.02-.036-.04-.073-.058-.11l.045-.015.013.122v.003z"
        fill="#FABD01"
      />
      <Path
        d="M34.278 17.88l.337.014c.052.587-.268.95-.737 1.226l-.19-.387c.44-.116.577-.441.59-.853z"
        fill="#73B058"
      />
      <Path
        d="M36.259 24.072l1.205 2.596c-.525.228-1.036.496-1.576.676-1.043.346-2.132.339-3.217.322.037-.46.077-.92.108-1.38.042-.603.08-1.206.118-1.809l.028.001c1.14.166 2.238.001 3.304-.417l.03.011z"
        fill="#016700"
      />
      <Path
        d="M36.229 24.06c-1.066.419-2.164.584-3.304.418l.106-1.852a.072.072 0 00.036-.015c.795.112 1.528-.137 2.263-.38a.072.072 0 00.047.004l.852 1.826z"
        fill="#028A37"
      />
      <Path
        d="M35.329 22.232c-.735.242-1.469.491-2.263.379l.031-.753.181-2.596.596-.076 1.116 2.235.339.81z"
        fill="#038B21"
      />
      <Path
        d="M34.99 21.422l-1.116-2.235a.66.66 0 00.006-.067c.468-.275.788-.64.736-1.226l.028-.233c.122.076.242.213.368.217.74.025 1.482.02 2.223.025-.065 1.608-.797 2.792-2.245 3.519z"
        fill="#F6ED7F"
      />
      <Path
        d="M36.228 24.06l-.852-1.825c.073-.065.137-.148.22-.195 1.175-.65 1.925-1.642 2.27-2.923.102-.383.035-.81.046-1.218l2.526-.006c-.1 2.758-1.392 4.755-3.841 6.012-.112.058-.227.112-.34.168l-.03-.012z"
        fill="#DCEBD9"
      />
      <Path
        d="M37.914 17.898c-.011.407.056.836-.047 1.218-.343 1.28-1.094 2.272-2.269 2.923-.084.047-.147.13-.22.196a.072.072 0 01-.047-.003l-.34-.81c1.448-.728 2.18-1.91 2.245-3.52l.678-.004z"
        fill="#D6DB6F"
      />
    </Svg>
  )
}

export default SvgComponent