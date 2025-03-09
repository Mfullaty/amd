import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";
import { Resend } from "resend";
import EmailTemplate from "@/components/auth/email-template";
export async function PUT(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    //extract the data
    const { email } = await request.json();
    //Check if the user Already exists in the db
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      return NextResponse.json(
        {
          data: null,
          message: `User Not Found`,
        },
        { status: 404 }
      );
    }
    //Generate Token
    // Generate a random UUID (version 4)
    const rawToken = uuidv4();
    // Encode the token using Base64 URL-safe format
    const token = base64url.encode(rawToken);
    if (!token) {
      return NextResponse.json(
        {
          data: null,
          message: `Failed to generate password reset token`,
        },
        { status: 500 }
      );
    }
    // Update a User in the DB
    const updatedUser = await db.user.update({
      where: {
        email,
      },
      data: {
        passwordResetToken: token,
      },
    });
    if (!updatedUser) {
      return NextResponse.json(
        {
          data: null,
          message: `Failed to update user password reset token`,
        },
        { status: 500 }
      );
    }
    //Send an Email with the Token on the link as a search param
    const linkText = "Reset Password";
    const userId = existingUser.id;
    const name = existingUser.name;
    const redirectUrl = `reset-password?token=${token}&id=${userId}`;
    const description =
      "Click on the following link in order to reset your password. Thank you";
    const subject = "Password Reset - Arewa Fashion Designs";
    const sendMail = await resend.emails.send({
      from: "Arewa Fashion Designs <contact@fashionarewa.com>",
      to: email,
      subject: subject,
      react: EmailTemplate({
        name,
        redirectUrl,
        linkText,
        description,
        subject,
      }),
    });
    if (!sendMail) {
      return NextResponse.json(
        {
          data: null,
          message: `Failed to send email to ${email}`,
        },
        { status: 500 }
      );
    }
    //Upon Click redirect them to the login

    console.log(token);
    return NextResponse.json(
      {
        data: null,
        message: "User Updated Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Server Error: Something went wrong",
      },
      { status: 500 }
    );
  }
}
