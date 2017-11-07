package jp.enpit.lama.entities;

import javax.xml.bind.annotation.XmlElement;

public class Husen {
    @XmlElement(name="hid")
    private int hid;
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
    private boolean canEdit;

    public Husen() {}
    
    public Husen(String text, String xPosition, String yPosition, String height,
            int good, int bad, int color, boolean canEdit){
        this.text = text;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.height = height;
        this.good = good;
        this.bad = bad;
        this.color = color;
        this.canEdit = canEdit;
    }
    
    public Husen(int hid, String text, String xPosition, String yPosition, String height,
    		int good, int bad, int color, boolean canEdit){
        this(text, xPosition, yPosition, height, good, bad, color, canEdit);
        setHid(hid);
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

	public boolean getCanEdit() {
		return canEdit;
	}

	public int getHid(){
        return hid;
    }
	
	public void setHid(Integer hid){
		this.hid = hid;
	}
	
	@Override
	public String toString(){
		String str="{";
		str = str + "hid = "+ hid+
        " : text = \""+ text+
        "\" : xPosition = \""+ xPosition+
        "\" : yPosition = \""+ yPosition+
        "\" : height = \""+ height+
        "\" : good = "+ good+
        " : bad = "+ bad+
        " : color = "+ color+
        " : canEdit = "+ canEdit +"}";
		return str;
	}
}
