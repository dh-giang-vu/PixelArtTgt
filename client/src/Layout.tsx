import './styles/layout.css';

export default function Layout({ children } : { children: React.ReactNode }) {
  return (
    <>
      <div className="layout-container">
        <div className="header" >Pixel Art TGT</div>
        <div className="layout-body">{ children }</div>
        <div className="footer">@github.com/dh-giang-vu</div>
      </div>
    </>
  )
}
