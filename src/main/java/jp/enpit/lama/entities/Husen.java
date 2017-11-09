package jp.enpit.lama.entities;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Husen {
    @XmlElement(name="cid")
    private int cid;
    @XmlElement(name="text")
    private String text;
    @XmlElement(name="xPosition")
    private String xPosition;
    @XmlElement(name="yPosition")
    private String yPosition;
    @XmlElement(name="height")
    private String height;
    @XmlElement(name="good")
    private int good;
    @XmlElement(name="bad")
    private int bad;
    @XmlElement(name="color")
    private int color;
    @XmlElement(name="canEdit")
    private int canEdit;

    public Husen(){
    	
    }
    
    public Husen(int cid){
    	this.cid = cid;
    }
    
    public Husen(int cid,String text,String xPosition,String yPosition,String height,
    		int good, int bad, int color, int canEdit){
        this.cid = cid;
        this.text = text;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.height = height;
        this.good = good;
        this.bad = bad;
        this.color = color;
        this.canEdit = canEdit;
    }

    public String getText() {
		return text;
	}

	public String getxPosition() {
		return xPosition;
	}

	public String getyPosition() {
		return yPosition;
	}

	public int getGood() {
		return good;
	}
	
	public String getHeight(){
		return height;
	}

	public int getBad() {
		return bad;
	}

	public int getColor() {
		return color;
	}

	public int getCanEdit() {
		return canEdit;
	}

	public int getCid(){
        return cid;
    }
	
	public void setCid(Integer cid){
		this.cid = cid;
	}

	public void setCid(int cid) {
		this.cid = cid;
	}

	public void setText(String text) {
		this.text = text;
	}

	public void setxPosition(String xPosition) {
		this.xPosition = xPosition;
	}

	public void setyPosition(String yPosition) {
		this.yPosition = yPosition;
	}

	public void setHeight(String height) {
		this.height = height;
	}

	public void setGood(int good) {
		this.good = good;
	}

	public void setBad(int bad) {
		this.bad = bad;
	}

	public void setColor(int color) {
		this.color = color;
	}

	public void setCanEdit(int canEdit) {
		this.canEdit = canEdit;
	}
	
//	public String toString(){
//		String str="{";
//		str = str + "cid = "+ cid+
//        " : text = \""+ text+
//        "\" : xPosition = \""+ xPosition+
//        "\" : yPosition = \""+ yPosition+
//        "\" : height = \""+ height+
//        "\" : good = "+ good+
//        " : bad = "+ bad+
//        " : color = "+ color+
//        " : canEdit = "+ canEdit +"}";
//		return str;
//	}
}
